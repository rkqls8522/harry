import yake

def extract_keywords_yake(text: str):
    try:
        
        kw_extractor = yake.KeywordExtractor(lan="en", n=1, top=10, dedupLim=0.3)
        all_keywords = kw_extractor.extract_keywords(text)
        
        sorted_keywords = sorted(all_keywords, key=lambda x: x[1])
        
        # print("\n상위 10 키워드 (키워드, 점수):")
        # for kw, score in sorted_keywords[:10]:
        #     print(kw, score)
        # print("\n")
        
        top_keywords = sorted_keywords[:4]
        # print("\n상위 4 키워드:")
        # for kw, score in top_keywords:
        #     print(kw, score)
        # print("\n")

        return [kw for kw, score in top_keywords]
    
    except Exception as e:
        print(f"키워드 추출 중 오류 발생: {e}")
        raise ValueError(f"키워드 추출 중 오류 발생: {e}")
        
