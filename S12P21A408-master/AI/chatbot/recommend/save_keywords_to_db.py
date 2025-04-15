from db_pool import get_db_connection
from pymysql import MySQLError

def save_keywords_to_db(member_id: int, keywords: list, timestamp: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        for keyword in keywords:
            cursor.execute("""
                INSERT INTO page_keyword (member_id, keyword, created_at)
                VALUES (%s, %s, %s)
            """, (member_id, keyword, timestamp))

            cursor.execute("""
                INSERT INTO user_keyword (member_id, keyword, cnt)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE cnt = cnt + 1
            """, (member_id, keyword, 1))

        conn.commit()

        print(f"{len(keywords)}개의 키워드를 DB에 저장하고, cnt 값을 업데이트했습니다.")
    
    except MySQLError as e:
        conn.rollback()
        print(f"DB 오류 발생: {str(e)}")
        # MySQL 오류가 발생한 경우, 예외를 던짐
        raise ValueError(f"DB 오류: {e}")
    
    except Exception as e:
        print(f"키워드 저장 중 오류 발생: {e}")
        # 그 외의 오류가 발생한 경우, 예외를 던짐
        raise ValueError(f"키워드 저장 오류: {e}")
    
    finally:
        cursor.close()
        conn.close()
