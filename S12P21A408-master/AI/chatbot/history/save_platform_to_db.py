from db_pool import get_db_connection
from pymysql import MySQLError

def save_platforms_to_db(member_id, top_platforms, all_platforms):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        for platform_name in all_platforms:
            cursor.execute("""
                INSERT INTO platform (name)
                VALUES (%s)
                ON DUPLICATE KEY UPDATE name = name
            """, (platform_name,)) 

        for platform_name, _ in top_platforms:
            cursor.execute("SELECT platform_id FROM platform WHERE name = %s", (platform_name,))
            platform_id = cursor.fetchone()["platform_id"]  # platform_id 가져오기

            cursor.execute("""
                INSERT INTO user_platform (member_id, platform_id)
                VALUES (%s, %s)
            """, (member_id, platform_id))

        conn.commit()
    
    except MySQLError as e:
        conn.rollback()
        raise MySQLError(f"DB 오류 발생: {str(e)}")
    
    except Exception as e:
        conn.rollback()
        raise Exception(f"도메인 저장 중 오류 발생: {str(e)}")
    
    finally:
        cursor.close()
        conn.close()
