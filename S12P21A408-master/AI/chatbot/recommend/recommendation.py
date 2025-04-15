from time import time
from recommend.content_extractor import extract_main_content
from recommend.keyword_extractor import extract_keywords_yake
from recommend.google_search import google_search
from recommend.save_keywords_to_db import save_keywords_to_db
from datetime import datetime

num = 3

def get_recommendations(member_id: int, url: str) -> dict:
    overall_start_time = time()
    
    # a. 본문 텍스트 추출
    try:
        a_start_time = time()
        main_text = extract_main_content(url)
        a_elapsed = time() - a_start_time
        print(f"본문 텍스트 추출 소요 시간: {a_elapsed:.2f}초")
    except Exception as e:
        print(f"본문 텍스트 추출 중 오류: {e}")
        return {
            "code": 500,
            "message": "본문 텍스트 추출 중 오류",
            "content": {}
        }
    
    if not main_text or main_text.strip() == "":
        print("본문 텍스트가 비어있거나 공백입니다.")
        return {
            "code": 200,
            "message": "추출할 본문이 없습니다",
            "content": {}
        }
    
    # b. 키워드 추출
    try:
        b_start_time = time()
        noun_keywords, all_keywords = extract_keywords_yake(main_text)
        b_elapsed = time() - b_start_time
        print(f"키워드 추출 소요 시간: {b_elapsed:.2f}초")
        
    except Exception as e:
        return {
            "code": 500,
            "message": f"키워드 추출 중 오류: {e}",
            "content": {}
        }

    
    # c. DB 저장
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        c_start_time = time()
        save_keywords_to_db(member_id, noun_keywords, timestamp)
        c_elapsed = time() - c_start_time
        print(f"DB저장 소요 시간: {c_elapsed:.2f}초")
        
    except Exception as e:
        return {
            "code": 500,
            "message": f"DB 저장 중 오류: {e}",
            "content": {}
        }
    
    # d. 구글 검색 실행
    try:
        query = " AND ".join(all_keywords) + " -site:" + url
        
        search_results = google_search(query, num, 1)

    except Exception as e:
        return {
            "code": 500,
            "message": f"구글 검색 중 오류: {e}",
            "content": {}
        }
    
    if not search_results:
        return {
            "code": 200,
            "message": "관련 글이 없습니다.",
            "content": {}
        }
    
    
    # e. 추천 항목 구성
    recommendations = {
        "keyword": noun_keywords[0],
        "recommendations" : search_results
    }

    overall_elapsed = time() - overall_start_time
    print(f"전체 추천 로직 소요 시간: {overall_elapsed:.2f}초")
    
    return {
        "code": 200,
        "message": "success",
        "content": recommendations
    }
