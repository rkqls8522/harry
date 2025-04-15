from fastapi.responses import JSONResponse
from .platform_extractor import get_top_platforms
from .save_platform_to_db import save_platforms_to_db
from .save_keywords_with_time import extract_and_save_keywords
from time import time

def process_histories_keywords(json_data, member_id):
    overall_start_time = time()

    # a. 플랫폼 추출
    try:
        a_start_time = time()

        top_platforms, all_platforms = get_top_platforms(json_data)

        a_elapsed = time() - a_start_time
        print(f"플랫폼 추출 소요 시간: {a_elapsed:.2f}초")

    except Exception as e:
        return {
            "code": 500,
            "message": f"플랫폼 추출 중 오류: {e}",
            "content": {}
        }

    # b. 플랫폼 추출한 것 db에 저장
    try:
        b_start_time = time()
        save_platforms_to_db(member_id, top_platforms, all_platforms)
        
        b_elapsed = time() - b_start_time
        print(f"플랫폼 DB에 저장 소요 시간: {b_elapsed:.2f}초")

    except Exception as e:
        return {
            "code": 500,
            "message": f"플랫폼 저장 중 오류발생. {e}",
            "content": {}
        }

    # c. 키워드 추출 및 저장
    try:
        c_start_time = time()

        extract_and_save_keywords(json_data, member_id)

        c_elapsed = time() - c_start_time
        print(f"키워드 추출 및 저장 소요 시간: {c_elapsed:.2f}초")

    except Exception as e:
        return {
            "code": 500,
            "message": f"키워드 추출 및 저장 중 오류발생. {e}",
            "content": {}
        }
        
    overall_elapsed = time() - overall_start_time
    print(f"전체 처리 소요 시간: {overall_elapsed:.2f}초")

    return {
        "code": 201,
        "message": "히스토리 키워드 처리 성공"
    }