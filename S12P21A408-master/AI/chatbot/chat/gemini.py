import requests
import json
from datetime import datetime, timedelta
import pymysql
from typing import Optional, Dict, List
from pymysql.cursors import DictCursor
from dbutils.pooled_db import PooledDB
from chat.feeling import analyze_emotion
import re

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
GEMINI_API_KEY = "AIzaSyDwxwFfDd-Z4GQq5kfMDVa1GgUtDlUOOaA"

# DB 연결 풀 설정
DB_POOL = PooledDB(
    creator=pymysql,
    maxconnections=5,  # 최대 연결 수
    mincached=1,       # 최소 캐시 연결 수
    maxcached=3,       # 최대 캐시 연결 수
    host='stg-yswa-kr-practice-db-master.mariadb.database.azure.com',
    port=3306,
    user='S12P22A408@stg-yswa-kr-practice-db-master',
    password='t9hurA0fqX',
    database='S12P22A408',
    charset='utf8mb4',
    cursorclass=DictCursor
)

def parse_gemini_response(response_json: Dict) -> Optional[tuple]:
    try:
        text = response_json['candidates'][0]['content']['parts'][0]['text']
        lines = text.strip().split('\n')

        # Q:로 시작하는 줄이 있는지 확인 (일정 조회인 경우)
        if any(line.strip().startswith('Q:') for line in lines):
            query_line = next(line for line in lines if line.strip().startswith('Q:'))
            query_keywords = query_line.replace('Q:', '').strip()
            
            # 나머지 줄은 응답 메시지 템플릿으로 (실제 일정 정보로 대체될 예정)
            response_template = '\n'.join(line for line in lines 
                                        if not line.strip().startswith('Q:')).strip()
            
            return "schedule_query", query_keywords, response_template
        
        # S:로 시작하는 줄이 있는지 확인 (스크랩인 경우)
        if any(line.strip().startswith('S:') for line in lines):
            title_line = next(line for line in lines if line.strip().startswith('S:'))
            title = title_line.replace('S:', '').strip()
            
            # 두 번째 줄부터의 내용을 응답 메시지로
            response_message = '\n'.join(line for line in lines 
                                       if not line.strip().startswith('S:')).strip()
            
            return "scrap", title, response_message
        
        # M:로 시작하는 줄이 있는지 확인 (메모인 경우)
        if any(line.strip().startswith('M:') for line in lines):
            content_line = next(line for line in lines if line.strip().startswith('M:'))
            tag_line = next(line for line in lines if line.strip().startswith('T:'))
            
            content = content_line.replace('M:', '').strip()
            tags = [int(tag) for tag in tag_line.replace('T:', '').strip().split(',') if tag.strip()]
            
            # 나머지 줄은 응답 메시지로
            response_message = '\n'.join(line for line in lines 
                                       if not line.strip().startswith(('M:', 'T:'))).strip()
            
            return "memo", content, tags, response_message
        
        # K:로 시작하는 줄이 있는지 확인 (지식인 경우)
        if any(line.strip().startswith('K:') for line in lines):
            # K: 로 시작하는 줄에서 K: 제거하고 응답 메시지로 사용
            knowledge_line = next(line for line in lines if line.strip().startswith('K:'))
            response_message = knowledge_line.replace('K:', '').strip()
            
            return "knowledge", response_message
            
        # A:로 시작하는 줄이 있는지 확인 (일정 저장인 경우)
        elif any(line.strip().startswith('A:') for line in lines):
            timestamp_line = next(line for line in lines if line.strip().startswith('A:'))
            content_line = next(line for line in lines if line.strip().startswith('B:'))
            
            timestamp = timestamp_line.replace('A:', '').strip()
            content = content_line.replace('B:', '').strip()
            
            # timestamp를 datetime 객체로 변환
            expire_time = datetime.strptime(timestamp, '%Y-%m-%d %H:%M')
            
            # 기본적으로 하루 전으로 알람 설정
            alarm_time = expire_time - timedelta(days=1)
            
            # 현재 시간 가져오기
            current_time = datetime.now()
            
            # 알람 시간이 현재 시간보다 이전이면 현재 시간으로 설정
            if alarm_time < current_time:
                alarm_time = current_time
            
            # 세 번째 줄부터의 내용을 응답 메시지로 사용
            response_message = '\n'.join(line for line in lines 
                                       if not line.strip().startswith(('A:', 'B:'))).strip()
            
            return "schedule_save", expire_time, alarm_time, content, response_message
        else:
            # 일반 대화인 경우
            return "chat", text.strip()
                
    except Exception as e:
        print(f"Error parsing response: {e}")
        print(f"Full response text: {text if 'text' in locals() else 'text not available'}")
    return None

def save_to_database(member_id: int, expire_time: datetime, alarm_time: datetime, content: str):
    try:
        print("Getting connection from pool...")
        conn = DB_POOL.connection()
        print("Got connection from pool")
        
        with conn.cursor() as cursor:
            print("Cursor created")
            
            expire_time_str = expire_time.strftime('%Y-%m-%d %H:%M:%S')
            alarm_time_str = alarm_time.strftime('%Y-%m-%d %H:%M:%S')
            
            query = """
            INSERT INTO schedules (member_id, content, expire_time, alarm_time, alarm_sent)
            VALUES (%s, %s, %s, %s, %s)
            """
            values = (member_id, content, expire_time_str, alarm_time_str, False)
            
            print(f"Executing query with values: {values}")
            cursor.execute(query, values)
            conn.commit()
            
            # 확인
            cursor.execute("SELECT * FROM schedules ORDER BY id DESC LIMIT 1")
            result = cursor.fetchone()
            print(f"Last inserted record: {result}")
            
    except Exception as e:
        print(f"Error: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'conn' in locals():
            conn.close()
            print("Connection returned to pool")

def query_schedules(member_id: int, keywords: str) -> List[Dict]:
    """
    일정 테이블에서 키워드를 포함하는 일정을 검색하는 함수
    """
    try:
        conn = DB_POOL.connection()
        results = []
        
        with conn.cursor() as cursor:
            # 키워드를 공백으로 분리하여 각각의 키워드를 포함하는 일정 검색
            keyword_list = keywords.split()
            like_conditions = []
            params = [member_id]
            
            for keyword in keyword_list:
                like_conditions.append("content LIKE %s")
                params.append(f"%{keyword}%")
            
            where_clause = " OR ".join(like_conditions)
            
            query = f"""
            SELECT id, content, expire_time 
            FROM schedules 
            WHERE member_id = %s AND ({where_clause})
            ORDER BY expire_time DESC
            """
            
            print(f"Executing query: {query} with params: {params}")
            cursor.execute(query, params)
            results = cursor.fetchall()
            
            # datetime 객체를 문자열로 변환
            for result in results:
                if isinstance(result['expire_time'], datetime):
                    result['expire_time'] = result['expire_time'].strftime('%Y-%m-%d %H:%M')
            
            return results
            
    except Exception as e:
        print(f"Error querying schedules: {e}")
        return []
    finally:
        if 'conn' in locals():
            conn.close()

def save_memo_to_database(member_id: int, content: str, tags: List[int]):
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            # 메모 생성
            query = """
            INSERT INTO quick_memo (content, created_at, member_id)
            VALUES (%s, %s, %s)
            """
            values = (content, datetime.now(), member_id)
            cursor.execute(query, values)
            memo_id = cursor.lastrowid

            # 태그 처리
            for tag_id in tags:
                # 태그가 존재하는지 확인
                cursor.execute("SELECT id FROM tags WHERE id = %s", (tag_id,))
                tag_exists = cursor.fetchone()
                
                if not tag_exists:
                    # 태그가 없으면 새로 생성
                    cursor.execute(
                        "INSERT INTO tags (id, name, member_id) VALUES (%s, %s, %s)",
                        (tag_id, f"태그_{tag_id}", member_id)
                    )
                
                # 메모와 태그 연결
                tag_query = """
                INSERT INTO quick_memo_tag (quick_memo_id, tag_id, member_id)
                VALUES (%s, %s, %s)
                """
                cursor.execute(tag_query, (memo_id, tag_id, member_id))

            conn.commit()
            return True
            
    except Exception as e:
        print(f"Error saving memo: {e}")
        if 'conn' in locals():
            conn.rollback()
        return False
    finally:
        if 'conn' in locals():
            conn.close()

def process_gemini_request(member_id: int, message: str, page_info: Optional[Dict] = None, token: Optional[str] = None):
    current_date = datetime.now().strftime("%Y-%m-%d")
    current_page_title = page_info.title if hasattr(page_info, 'title') and page_info.title else "현재 페이지"

    
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": f"""오늘은 {current_date} 입니다.
                당신은 친근하고 다정한 AI 친구이고, 당신의 이름은 "해리"입니다.
                예를 들어, "해리야, 안녕?" 이라고 말하면, 당신의 이름이 바로 "해리"인 것입니다.
                모든 응답은 다정하고 친근하며 든든한 친구처럼 응답해주세요.
                웹드라마 양파의 왕따일기 양미희 캐릭터처럼 
                유머있고 앙큼하게 재밌는 친구처럼 응답해주세요.
                
                만약 메시지가 일정이나 약속을 '저장'해달라는 내용이라면:
                1. 첫 줄에 "A: YYYY-MM-DD HH:mm" 형식으로 날짜와 시간을 작성
                2. 두 번째 줄에 "B: " 뒤에 일정 내용을 작성
                3. 세 번째 줄에 일정 추가 확인과 함께 친근하게 응답

                만약 메시지가 일정이나 약속을 '조회'해달라는 내용이라면:
                1. 첫 줄에 "Q: " 뒤에 검색할 키워드를 작성
                2. 두 번째 줄부터는 일정 조회 응답 템플릿을 작성
                (시스템이 자동으로 일정 정보로 대체해줄 것입니다)

                만약 메시지가 메모로 저장해야 할 내용이라면:
                1. 첫 줄에 "M: " 뒤에 메모 내용을 작성
                2. 두 번째 줄에 "T: " 뒤에 관련 태그 번호를 쉼표로 구분하여 작성
                3. 세 번째 줄에 메모 저장 확인과 함께 친근하게 응답

                만약 메시지가 현재 페이지를 스크랩해달라는 내용이라면:
                1. 첫 줄에 "S: " 뒤에 스크랩할 페이지 제목을 작성
                2. 두 번째 줄에서는 실제 제목인 "{current_page_title}"을 포함해서 자연스럽고 친근하게 응답

                만약 메시지가 '스크랩', '스크랩해', '스크랩해줘', '이거 스크랩', '페이지 스크랩' 등 스크랩과 관련된 단어나 문구를 포함하고 있다면:
                1. 사용자가 특정 페이지를 명시하지 않았더라도, 항상 현재 페이지를 스크랩하는 것으로 처리합니다.
                2. 첫 줄에 "S: {current_page_title}" 형식으로 작성하세요.
                3. 두 번째 줄부터는 "{current_page_title} 페이지를 스크랩했어요! 나중에 다시 찾아보실 수 있도록 저장해둘게요 ✨"와 같이 현재 페이지 제목을 포함한 확인 메시지를 작성하세요.
                4. "어떤 페이지를 스크랩해 드릴까요?  페이지 제목을 알려주시면 바로 스크랩해 드릴게요"와 같은 질문은 절대 하지 마세요.

                만약 사용자가 지식이나 학습 개념, 정보에 대해 물어본다면:
                1. 첫 줄에 "K: " 뒤에 해당 개념을 100자 이내로 간결하게 설명해주세요.
                2. 해당 개념을 쉽고 명확하게 설명하되, 전문적인 정확성도 유지해주세요.
                3. 비유나 예시를 활용해 복잡한 개념도 이해하기 쉽게 설명해주세요.
                4. 질문의 핵심만 정확히 파악해 불필요한 설명은 생략하세요.
                5. 기존의 유머있고 앙큼한 성격은 유지하면서 '똑똑한 해리'가 되어야 해요.

                예시 (메모인 경우):
                M: 오늘 배운 Spring Boot 내용 정리
                T: 1,2,3
                네, 학습 내용을 메모로 저장했어요! 태그로 쉽게 찾아보실 수 있을 거예요 😊

                예시 (일정 저장인 경우):
                A: 2024-03-20 14:00
                B: 회의
                네, 3월 20일 오후 2시 회의 일정을 추가했어요! 하루 전에 다시 알려드릴게요 😊

                예시 (일정 조회인 경우):
                Q: 영화 보는
                찾아봤더니, [일정 내용] 일정이 [날짜 시간]에 있네요! 잊지 말고 챙겨보세요 😉

                예시 (일정 조회 다른 예시):
                Q: 신한은행 면접
                신한은행 면접 일정은 [날짜 시간]에 있어요! 준비 잘 하셔서 합격하길 바랄게요 ✨

                예시 (스크랩인 경우):
                S: {current_page_title}
                '{current_page_title}' 페이지를 스크랩했어요! 나중에 다시 찾아보실 수 있도록 저장해둘게요 ✨

                예시 (지식 관련 질문인 경우):
                K: 블록체인은 거래 정보를 블록 단위로 저장하고 여러 컴퓨터에 복사해서 안전하게 보관하는 기술이에요! 한번 저장된 정보는 바꿀 수 없어서 금융거래나 계약에 많이 활용된답니다 💫

                일정, 메모, 스크랩이 아닌 경우에는 친근하고 공감하는 말투로 자연스럽게 대화해주세요.

                중요: 일정 조회 질문인지 저장 요청인지 구분해주세요. 
                - "내일 회의 있어", "다음주 월요일에 약속 잡아줘" 등은 일정 저장이에요.
                - "영화 보는 일정 언제였지?", "신한은행 면접 언제였더라?" 등은 일정 조회예요.

                입력 메시지:
                {message}"""
                .replace("{current_page_title}", page_info.title if hasattr(page_info, 'title') and page_info.title else "현재 페이지")
            }]
        }]
    }
    
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=data)
        response_json = response.json()
        
        print("Gemini Response:", response_json)
        
        # 응답 파싱
        parsed_data = parse_gemini_response(response_json)
        if parsed_data:
            type = parsed_data[0]
            
            if type == "schedule_query":  # 일정 조회인 경우
                _, query_keywords, response_template = parsed_data
                
                # DB에서 일정 조회
                schedules = query_schedules(member_id, query_keywords)
                
                if schedules and len(schedules) > 0:
                    # 가장 가까운 일정을 선택 (또는 가장 최근 일정)
                    schedule = schedules[0]
                    
                    # 실제 찾은 내용으로 직접 메시지 구성 (템플릿 무시)
                    content = schedule['content']
                    date_time = schedule['expire_time']
                    
                    # 날짜 형식 변환 (YYYY-MM-DD HH:MM -> YYYY년 MM월 DD일 HH시 MM분)
                    try:
                        dt_parts = date_time.split(' ')
                        date_parts = dt_parts[0].split('-')
                        time_parts = dt_parts[1].split(':')
                        
                        formatted_date = f"{date_parts[0]}년 {date_parts[1]}월 {date_parts[2]}일"
                        formatted_time = f"{time_parts[0]}시 {time_parts[1]}분"
                        formatted_datetime = f"{formatted_date} {formatted_time}"
                    except:
                        # 형식 변환에 실패하면 원래 형식 사용
                        formatted_datetime = date_time
                    
                    response_message = f"'{content}' 일정이 {formatted_datetime}에 있어요! 잊지 말고 챙겨보세요 😉"
                    
                    return {
                        "success": True,
                        "message": response_message,
                        "schedule_query": {
                            "found": True,
                            "content": content,
                            "dateTime": date_time
                        }
                    }
                else:
                    # 일정을 찾지 못한 경우
                    return {
                        "success": True,
                        "message": f"죄송해요, '{query_keywords}'와 관련된 일정을 찾지 못했어요. 캘린더 페이지에서 더 상세한 정보를 찾아보아요!",
                        "schedule_query": {
                            "found": False
                        }
                    }
            
            elif type == "schedule_save":  # 일정 저장인 경우
                _, expire_time, alarm_time, content, response_message = parsed_data
                save_to_database(member_id, expire_time, alarm_time, content)
                return {
                    "success": True,
                    "message": response_message,
                    "schedule": {
                        "dateTime": expire_time.strftime('%Y-%m-%d %H:%M'),
                        "content": content
                    }
                }
            elif type == "memo":  # 메모인 경우
                _, content, tags, response_message = parsed_data
                if save_memo_to_database(member_id, content, tags):
                    return {
                        "success": True,
                        "message": response_message,
                        "memo": {
                            "content": content,
                            "tags": tags
                        }
                    }
            elif type == "knowledge": # 지식 관련 질문인 경우
                _, response_message = parsed_data
                return {
                    "success": True,
                    "message": response_message,
                }    
            elif type == "scrap" and page_info and token:  # 스크랩인 경우
                _, title, response_message = parsed_data
                
                # 스크랩 API 호출
                try:
                    scrap_headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {token}"
                    }
                    
                    scrap_data = {
                        "url": page_info.url if hasattr(page_info, 'url') else None,
                        "title": (page_info.title if hasattr(page_info, 'title') else None) or title,
                        "image": page_info.image if hasattr(page_info, 'image') else None,
                        "isNotified": page_info.isNotified if hasattr(page_info, 'isNotified') else False
                    }

                    # 스크랩 API 호출 전에 로그 출력
                    print(f"✅ 스크랩 API 호출 시작: URL={page_info.url if hasattr(page_info, 'url') else None}, 제목={(page_info.title if hasattr(page_info, 'title') else None) or title}")

                    
                    scrap_response = requests.post(
                        "https://j12a408.p.ssafy.io/api/scraps",
                        headers=scrap_headers,
                        json=scrap_data
                    )

                    # 스크랩 API 응답 결과 로그 출력
                    print(f"✅ 스크랩 API 응답: 상태={scrap_response.status_code}, 응답={scrap_response.text[:100]}")
                    
                    if scrap_response.status_code in (200, 201):
                        return {
                            "success": True,
                            "message": response_message,
                            "scrap": {
                                "url": page_info.url if hasattr(page_info, 'url') else None,
                                "title": (page_info.title if hasattr(page_info, 'title') else None) or title
                            }
                        }
                    else:
                        print(f"스크랩 API 오류: {scrap_response.status_code}, {scrap_response.text}")
                        return {
                            "success": True,
                            "message": "페이지 스크랩 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요."
                        }
                except Exception as e:
                    print(f"스크랩 처리 중 오류: {e}")
                    return {
                        "success": True,
                        "message": "페이지 스크랩 기능에 문제가 생겼어요. 죄송합니다."
                    }
            
            else:  # 일반 대화인 경우
                # 감정 분석 수행
                emotion_result = analyze_emotion(message, member_id)
                if emotion_result:
                    response_message, emotions = emotion_result

                    # 클라이언트에 전달하기 전에 최종 검증(한 개의 감정만 10점인지 확인)
                    emotions_with_10 = [k for k, v in emotions.items() if v == 10]
                    if(len(emotions_with_10) > 1):
                        first_emotion = emotions_with_10[0]
                        emotions = {k: (10 if k == first_emotion else (v if v < 6 else 0)) for k, v in emotions.items()}
                    return {
                        "success": True,
                        "message": response_message,
                        "emotions": emotions
                    }
                else:
                    return {
                        "success": True,
                        "message": "죄송해요, 지금은 제가 잘 이해하지 못했어요."
                    }
            
        
        return {
            "success": False,
            "message": "죄송합니다. 메시지를 이해하지 못했어요. 다시 말씀해주시겠어요?"
        }
        
    except Exception as e:
        print(f"Error occurred: {e}")
        return {
            "success": False,
            "message": "죄송합니다. 오류가 발생했어요. 잠시 후 다시 시도해주세요."
        }