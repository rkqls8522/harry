import requests
import json
from typing import Dict, Optional, Tuple
import pymysql
from dbutils.pooled_db import PooledDB

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
GEMINI_API_KEY = "AIzaSyDwxwFfDd-Z4GQq5kfMDVa1GgUtDlUOOaA"

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

def update_feeling_scores(member_id: int, emotion_scores: Dict[str, int]) -> Dict[str, int]:
    """
    DB에 감정 점수를 업데이트하는 함수
    이 버전은 누적이 아닌 현재 감정 상태를 바로 설정합니다
    """
    try:
        conn = DB_POOL.connection()
        with conn.cursor() as cursor:
            # 현재 감정 점수 조회 또는 새로운 레코드 생성
            cursor.execute("SELECT * FROM feeling WHERE member_id = %s", (member_id,))
            current_feeling = cursor.fetchone()
            
            if not current_feeling:
                # 새로운 레코드 생성
                cursor.execute(
                    "INSERT INTO feeling (member_id) VALUES (%s)",
                    (member_id,)
                )
            
            # 감정 점수가 이미 처리된 상태라고 가정
            # 따라서 DB에 바로 업데이트
            updates = []
            values = []
            
            for emotion, value in emotion_scores.items():
                updates.append(f"{emotion} = %s")
                values.append(value)
            
            values.append(member_id)
            
            # DB 업데이트
            query = f"""
                UPDATE feeling 
                SET {', '.join(updates)}
                WHERE member_id = %s
            """
            cursor.execute(query, values)
            conn.commit()
            
            return emotion_scores
            
    except Exception as e:
        print(f"Error updating feeling scores: {e}")
        if 'conn' in locals():
            conn.rollback()
        return None
    finally:
        if 'conn' in locals():
            conn.close()

def analyze_emotion(message: str, member_id: int) -> Optional[Tuple[str, Dict]]:
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": f"""
                당신은 친근하고 다정한 AI 친구이고, 당신의 이름은 "해리"입니다.
                예를 들어, "해리야, 안녕?" 이라고 말하면, 당신의 이름이 바로 "해리"인 것입니다.
                모든 응답은 다정하고 친근하며 든든한 친구처럼 응답해주세요.
                웹드라마 양파의 왕따일기 양미희 캐릭터처럼 
                유머있고 앙큼하게 재밌는 친구처럼 응답해줘. 다만 응답은 100자 이내로 간결하게 해줘.

                당신은 채팅에 대한 미세한 감정을 잘 읽을 수 있습니다.
                다음 문장에 대해 가장 뚜렷하게 드러나는 감정을 주 감정으로 지정하고, 유사한 감정을 보조 감정을 판단해주세요.

                다음 형식으로 정확히 답변해주세요:
                E: 기쁨=변화량,슬픔=변화량,놀람=변화량,분노=변화량,역겨움=변화량,두려움=변화량  
                R: [공감적이고 친근한 응답]

                규칙:
                1. 감정 변화량은 아래 기준을 따릅니다:  
                - 주 감정 (가장 뚜렷한 1개): +10  
                - 보조 감정 (1개): +1 ~ +5 사이 (보통 +3 사용)  
                - 나머지 감정: -3 또는 -9

                2. 입력 문장에서 감정이 없거나 감정이 약하다면, 모든 감정을 0으로 설정합니다.
                3. 감정이 있을 경우, 가장 뚜렷한 감정 1개만 +10으로 설정합니다.
                4. 보조 감정도 +로 줄 수 있으나, +5를 초과하지 않습니다.
                5. 나머지 감정은 모두 감점 처리합니다.  
                - 주/보조 감정과 유사한 감정: -1  
                - 반대되거나 상반된 감정: -3

                감정 유사도 참고:
                - 기쁨 ↔ 놀람 (유사), ↔ 슬픔 (반대)
                - 슬픔 ↔ 두려움 (유사), ↔ 기쁨 (반대)
                - 분노 ↔ 역겨움 (유사), ↔ 기쁨/놀람 (반대)
                - 두려움 ↔ 놀람 (유사), ↔ 기쁨 (반대)

                예시:
                입력: "시험에 합격했어!"
                E: 기쁨=+10,슬픔=-3,놀람=+4,분노=-3,역겨움=-3,두려움=-1  
                R: 축하드려요! 열심히 준비한 만큼 좋은 결과를 얻으셨네요. 정말 기쁘시겠어요!

                예시:
                입력: "오늘 날씨 어때?"
                E: 기쁨=0,슬픔=0,놀람=0,분노=0,역겨움=0,두려움=0
                R: 오늘은 맑고 화창한 날씨예요. 외출하기 좋은 날이네요!

                입력 메시지: {message}"""
            }]
        }]
    }
    
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=data)
        response_json = response.json()
        
        text = response_json['candidates'][0]['content']['parts'][0]['text']
        lines = text.strip().split('\n')
        
        emotion_line = next(line for line in lines if line.strip().startswith('E:'))
        response_line = next(line for line in lines if line.strip().startswith('R:'))
        
        # 감정 점수 변화량 파싱
        emotion_text = emotion_line.replace('E:', '').strip()
        emotion_changes = {}
        for item in emotion_text.split(','):
            emotion, change = item.split('=')
            emotion_changes[emotion.strip()] = int(change)
        
        # 감정 영어 이름으로 변환
        english_emotions = {
            'happy': emotion_changes.get('기쁨', 0),
            'sad': emotion_changes.get('슬픔', 0),
            'surprise': emotion_changes.get('놀람', 0),
            'anger': emotion_changes.get('분노', 0),
            'disgust': emotion_changes.get('역겨움', 0),
            'fear': emotion_changes.get('두려움', 0)
        }
        
        # 감정값 처리 - 하나만 10점 갖도록 보장
        max_emotion = max(english_emotions.items(), key=lambda x: x[1])
        max_emotion_name, max_emotion_value = max_emotion
        
        # 모든 감정을 0으로 리셋
        processed_emotions = {k: 0 for k in english_emotions}
        
        # 가장 강한 감정만 10점 부여 (양수값일 때만)
        if max_emotion_value > 0:
            processed_emotions[max_emotion_name] = 10
            
            # 보조 감정 찾기 (최대 감정 제외)
            other_emotions = [(k, v) for k, v in english_emotions.items() 
                              if k != max_emotion_name and v > 0]
            
            # 보조 감정이 있으면 가장 강한 것 하나만 추가 (최대 5점)
            if other_emotions:
                other_emotions.sort(key=lambda x: x[1], reverse=True)
                secondary_emotion, sec_value = other_emotions[0]
                processed_emotions[secondary_emotion] = min(5, sec_value)
                
        # DB에 저장
        update_feeling_scores(member_id, processed_emotions)
        
        # 응답 메시지
        response_message = response_line.replace('R:', '').strip()
        
        return response_message, processed_emotions
        
    except Exception as e:
        print(f"Error in emotion analysis: {e}")
        return None