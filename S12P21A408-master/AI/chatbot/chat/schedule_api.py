from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import pymysql
from dbutils.pooled_db import PooledDB

# 라우터 생성
router = APIRouter(
    prefix="/ai/schedules",
    tags=["schedules"]
)

# DB 연결 풀 설정
DB_POOL = PooledDB(
    creator=pymysql,
    maxconnections=5,
    mincached=1,
    maxcached=3,
    host='stg-yswa-kr-practice-db-master.mariadb.database.azure.com',
    port=3306,
    user='S12P22A408@stg-yswa-kr-practice-db-master',
    password='t9hurA0fqX',
    database='S12P22A408',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

class Schedule(BaseModel):
    id: Optional[int] = None
    member_id: int
    content: str
    expire_time: datetime
    alarm_time: datetime

class ScheduleUpdate(BaseModel):
    content: Optional[str] = None
    expire_time: Optional[datetime] = None
    alarm_time: Optional[datetime] = None

class ScheduleCreate(BaseModel):
    member_id: int
    content: str
    expire_time: datetime
    alarm_time: datetime

@router.get("/{member_id}")
async def get_schedules(member_id: int):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM schedules WHERE member_id = %s ORDER BY expire_time",
                (member_id,)
            )
            schedules = cursor.fetchall()
            return schedules
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.put("/{schedule_id}", response_model=Schedule)
async def update_schedule(schedule_id: int, schedule: ScheduleUpdate):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            update_fields = []
            values = []
            if schedule.content is not None:
                update_fields.append("content = %s")
                values.append(schedule.content)
            if schedule.expire_time is not None:
                update_fields.append("expire_time = %s")
                values.append(schedule.expire_time)
            if schedule.alarm_time is not None:
                update_fields.append("alarm_time = %s")
                values.append(schedule.alarm_time)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            
            values.append(schedule_id)
            query = f"""
                UPDATE schedules 
                SET {', '.join(update_fields)}
                WHERE id = %s
                """
            cursor.execute(query, values)
            
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Schedule not found")
            
            cursor.execute("SELECT * FROM schedules WHERE id = %s", (schedule_id,))
            updated_schedule = cursor.fetchone()
            conn.commit()
            
            return updated_schedule
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: int):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM schedules WHERE id = %s", (schedule_id,))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Schedule not found")
            conn.commit()
            return {"message": "Schedule deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.post("/", response_model=Schedule)
async def create_schedule(schedule: ScheduleCreate):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            query = """
            INSERT INTO schedules (member_id, content, expire_time, alarm_time)
            VALUES (%s, %s, %s, %s)
            """
            values = (
                schedule.member_id,
                schedule.content,
                schedule.expire_time.strftime('%Y-%m-%d %H:%M:%S'),
                schedule.alarm_time.strftime('%Y-%m-%d %H:%M:%S')
            )
            
            cursor.execute(query, values)
            conn.commit()
            
            # 생성된 일정 조회
            cursor.execute(
                "SELECT * FROM schedules WHERE id = LAST_INSERT_ID()"
            )
            new_schedule = cursor.fetchone()
            
            if not new_schedule:
                raise HTTPException(status_code=500, detail="Failed to create schedule")
                
            return new_schedule
            
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close() 