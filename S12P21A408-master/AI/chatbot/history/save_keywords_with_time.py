from keybert import KeyBERT
from collections import Counter
from db_pool import get_db_connection
from pymysql import MySQLError
from static.check_noun import is_noun

kw_model = KeyBERT(model='sentence-transformers/paraphrase-MiniLM-L6-v2')

def extract_and_save_keywords(json_data, member_id):
    all_keywords = []

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        for item in json_data:
            title = item.title
            timestamp = item.timestamp

            keywords = kw_model.extract_keywords(title, top_n=3)
            
            # print("Extracted Keywords:", keywords)  # 추출된 키워드 확인

            # 명사만 필터링
            filtered_keywords = []
            for keyword in keywords:
                # print(f"keyword: {keyword}")  # 각 keyword 확인
                # print(f"keyword[0]: {keyword[0]}")  # 각 keyword 확인
                if is_noun(keyword[0]):
                    filtered_keywords.append(keyword[0])

            # print("Filtered Keywords (Nouns):", filtered_keywords)  # 명사만 필터링된 키워드 확인



            all_keywords.extend(filtered_keywords)

            for keyword in filtered_keywords:
                cursor.execute("""
                    INSERT INTO page_keyword (member_id, keyword, created_at)
                    VALUES (%s, %s, %s)
                """, (member_id, keyword, timestamp))

        keyword_counts = Counter(all_keywords)

        for keyword, count in keyword_counts.items():
            cursor.execute("""
                INSERT INTO user_keyword (member_id, keyword, cnt)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE cnt = cnt + %s
            """, (member_id, keyword, count, count))

        
        # 키워드 insert하는 작업이 끝난 후에, member테이블의 "has_visit_record"를 1로 업데이트
        cursor.execute("""
            UPDATE member
            SET has_visit_record = 1
            WHERE id = %s
        """, (member_id))


        conn.commit()

    except MySQLError as e:
        raise MySQLError(f"DB 오류 발생: {str(e)}")
    except Exception as e:
        raise Exception(f"키워드 저장 중 오류 발생: {str(e)}")
    finally:
        cursor.close()
        conn.close()
