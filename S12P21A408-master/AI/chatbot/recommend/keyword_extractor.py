import yake
from static.check_noun import is_noun

def extract_keywords_yake(text: str):
    try:
        kw_extractor = yake.KeywordExtractor(lan="en", n=1, top=20, dedupLim=0.3)
        all_keywords = [kw for kw, _ in kw_extractor.extract_keywords(text)]
        noun_keywords = []

        for kw in all_keywords:
            if is_noun(kw):
                noun_keywords.append(kw)

        # print("\n명사 10 키워드 (키워드):")
        # for kw in noun_keywords[:10]:
        #     print(kw)
        # print("\n")

        # print("\n상위 4 키워드 (키워드):")
        # for kw in all_keywords[:4]:
        #     print(kw)
        # print("\n")

        return noun_keywords[:10], all_keywords[:4]
    
    except Exception as e:
        print(f"키워드 추출 중 오류 발생: {e}")
        raise ValueError(f"키워드 추출 중 오류 발생: {e}")
        
