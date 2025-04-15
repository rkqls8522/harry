from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import pymysql
from dbutils.pooled_db import PooledDB

# 라우터 생성
router = APIRouter(
    prefix="/ai/memos",
    tags=["memos"]
)

# DB 연결 풀 설정 (schedule_api.py와 동일한 설정 사용)
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

# 메모 모델
class Memo(BaseModel):
    id: Optional[int] = None
    content: Optional[str]
    created_at: Optional[datetime]
    member_id: int

# 메모 태그 모델
class MemoTag(BaseModel):
    id: Optional[int] = None
    quick_memo_id: int
    tag_id: int
    member_id: int

# 메모 생성 모델
class MemoCreate(BaseModel):
    content: str
    member_id: int
    tags: List[int] = []

# 메모 수정 모델
class MemoUpdate(BaseModel):
    content: Optional[str] = None
    tags: Optional[List[int]] = None

@router.post("/", response_model=Memo)
async def create_memo(memo: MemoCreate):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            query = """
            INSERT INTO quick_memo (content, created_at, member_id)
            VALUES (%s, %s, %s)
            """
            values = (memo.content, datetime.now(), memo.member_id)
            cursor.execute(query, values)
            memo_id = cursor.lastrowid

            # 태그 처리
            if memo.tags:
                for tag_id in memo.tags:
                    # 태그가 존재하는지 확인
                    cursor.execute("SELECT id FROM tags WHERE id = %s", (tag_id,))
                    tag_exists = cursor.fetchone()
                    
                    if not tag_exists:
                        # 태그가 없으면 새로 생성
                        cursor.execute(
                            "INSERT INTO tags (id, name, member_id) VALUES (%s, %s, %s)",
                            (tag_id, f"태그_{tag_id}", memo.member_id)
                        )
                    
                    # 메모와 태그 연결
                    tag_query = """
                    INSERT INTO quick_memo_tag (quick_memo_id, tag_id, member_id)
                    VALUES (%s, %s, %s)
                    """
                    cursor.execute(tag_query, (memo_id, tag_id, memo.member_id))

            conn.commit()

            # 생성된 메모 조회
            cursor.execute("SELECT * FROM quick_memo WHERE id = %s", (memo_id,))
            new_memo = cursor.fetchone()
            return new_memo

    except Exception as e:
        conn.rollback()
        print(f"Error details: {str(e)}")  # 디버깅용
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/{member_id}")
async def get_memos(member_id: int):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            # 메모와 태그 정보를 함께 조회
            query = """
            SELECT m.*, GROUP_CONCAT(mt.tag_id) as tags
            FROM quick_memo m
            LEFT JOIN quick_memo_tag mt ON m.id = mt.quick_memo_id
            WHERE m.member_id = %s
            GROUP BY m.id
            ORDER BY m.created_at DESC
            """
            cursor.execute(query, (member_id,))
            memos = cursor.fetchall()
            
            # 태그 문자열을 리스트로 변환
            for memo in memos:
                if memo['tags']:
                    memo['tags'] = [int(tag) for tag in memo['tags'].split(',')]
                else:
                    memo['tags'] = []
            
            return memos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.put("/{memo_id}", response_model=dict)
async def update_memo(memo_id: int, memo: MemoUpdate):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            # 메모 내용 업데이트
            if memo.content is not None:
                cursor.execute(
                    "UPDATE quick_memo SET content = %s WHERE id = %s",
                    (memo.content, memo_id)
                )

            # 태그 업데이트
            if memo.tags is not None:
                # 기존 태그 삭제
                cursor.execute(
                    "DELETE FROM quick_memo_tag WHERE quick_memo_id = %s",
                    (memo_id,)
                )
                
                # 새로운 태그 추가
                if memo.tags:
                    # 메모의 member_id 조회
                    cursor.execute(
                        "SELECT member_id FROM quick_memo WHERE id = %s",
                        (memo_id,)
                    )
                    member_result = cursor.fetchone()
                    if not member_result:
                        raise HTTPException(status_code=404, detail="Memo not found")
                    
                    member_id = member_result['member_id']
                    
                    # 새 태그 추가
                    tag_query = """
                    INSERT INTO quick_memo_tag (quick_memo_id, tag_id, member_id)
                    VALUES (%s, %s, %s)
                    """
                    for tag_id in memo.tags:
                        cursor.execute(tag_query, (memo_id, tag_id, member_id))

            conn.commit()

            # 업데이트된 메모와 태그 조회
            query = """
            SELECT m.*, GROUP_CONCAT(mt.tag_id) as tags
            FROM quick_memo m
            LEFT JOIN quick_memo_tag mt ON m.id = mt.quick_memo_id
            WHERE m.id = %s
            GROUP BY m.id
            """
            cursor.execute(query, (memo_id,))
            updated_memo = cursor.fetchone()
            
            if not updated_memo:
                raise HTTPException(status_code=404, detail="Memo not found")
            
            # 태그 문자열을 리스트로 변환
            if updated_memo['tags']:
                updated_memo['tags'] = [int(tag) for tag in updated_memo['tags'].split(',')]
            else:
                updated_memo['tags'] = []
            
            return updated_memo

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.delete("/{memo_id}")
async def delete_memo(memo_id: int):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            # 연관된 태그 먼저 삭제
            cursor.execute("DELETE FROM quick_memo_tag WHERE quick_memo_id = %s", (memo_id,))
            
            # 메모 삭제
            cursor.execute("DELETE FROM quick_memo WHERE id = %s", (memo_id,))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Memo not found")
            
            conn.commit()
            return {"message": "Memo and associated tags deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
