import requests
from bs4 import BeautifulSoup
import chardet

def extract_main_content(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    res = requests.get(url, headers=headers)
    # print("=== DEBUG: HTTP Status:", res.status_code)
    # print("=== DEBUG: Response length:", len(res.text))

    detected_encoding = chardet.detect(res.content)['encoding']
    res.encoding = detected_encoding

    soup = BeautifulSoup(res.text, 'html.parser')
    
    
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        tag.decompose()
    
    candidates = soup.find_all(['article', 'section', 'div', 'main'])
    # print("=== DEBUG: Found candidates count:", len(candidates))
    
    main_text = ''
    max_len = 0
    for tag in candidates:
        text = tag.get_text(separator='\n', strip=True)
        if len(text) > max_len:
            main_text = text
            max_len = len(text)
    
    # print("=== DEBUG: Extracted main_text length:", len(main_text))
    # print(main_text)
    return main_text
