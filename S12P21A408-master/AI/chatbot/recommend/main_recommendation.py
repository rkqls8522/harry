from recommend.google_search import google_search
from time import time

num = 8

def get_main_recommendations(keywords, platform, offset):
    overall_start_time = time()

    # a. 키워드와 플랫폼으로 검색
    try:
        query = " AND ".join(keywords)
        
        query_with_platform = f"{query} site:{platform}"
        
        print(query_with_platform)
        
        search_results = google_search(query_with_platform, num, offset)

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
    

    overall_elapsed = time() - overall_start_time
    print(f"전체 추천 로직 소요 시간: {overall_elapsed:.2f}초")
    
    return {
        "code": 200,
        "message": "success",
        "content": search_results
    }
