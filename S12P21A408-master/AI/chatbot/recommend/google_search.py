import os
import requests
import json
import itertools
import tldextract


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))       # recommend/
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))    # AI/chatbot/
KEYS_PATH = os.path.join(ROOT_DIR, "google_keys.json")  


with open(KEYS_PATH, "r", encoding="utf-8") as f:
    key_data = json.load(f) 


CX = key_data["cx"]
API_KEYS = key_data["api_keys"]


api_key_cycle = itertools.cycle(list(API_KEYS.items()))

def google_search(query, num, offset):
    try:
    
        api_key_name, api_key_value = next(api_key_cycle)
        # print("=== DEBUG: Using API Key:", api_key_name)
        
        
        params = {
            'q': query,
            'key': api_key_value,
            'cx': CX,
            'num': num,
            'start': offset,
        }
        
        # print(params)
        response = requests.get("https://www.googleapis.com/customsearch/v1", params=params)
        
        
        if response.status_code != 200:
            raise Exception(f"Google API 요청 실패, HTTP 상태 코드: {response.status_code}")
        


        # print("=== DEBUG: HTTP Status:", response.status_code)
        
        search_results = response.json()
        results = []
        
        if 'items' in search_results:
            for item in search_results['items']:
                title = item.get('title')
                link = item.get('link')
                domain = tldextract.extract(link).domain                    
                thumbnail = item.get('pagemap', {}).get('cse_thumbnail', [{}])[0].get('src')

                results.append({
                    "title": title,
                    "link": link,
                    "domain": domain,
                    "thumbnail": thumbnail,
                })
        
        # print("=== DEBUG: Search results count:", len(results))
        return results
    except requests.exceptions.RequestException as e:
        print(f"Google API 요청 중 네트워크 에러 발생: {e}")
        raise ConnectionError(f"Google API 요청 중 네트워크 에러 발생: {e}")
    except Exception as e:
        print(f"예상치 못한 오류 발생: {e}")
        raise RuntimeError(f"예상치 못한 오류 발생: {e}")