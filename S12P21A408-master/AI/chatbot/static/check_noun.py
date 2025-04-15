import MeCab
tagger = MeCab.Tagger()

def is_noun(keyword: str):
    try:
        parsed = tagger.parse(keyword).strip().split('\n')
        parsed = [line for line in parsed if line != 'EOS' and line.strip()]

        if not parsed:
            return False

        last_line = parsed[-1]
        surface, features = last_line.split('\t')
        pos_tag = features.split(',')[0]

        # print(f"[DEBUG] 입력: {keyword} → 마지막 형태소: {surface}, 태그: {pos_tag}")

        return any(sub in pos_tag for sub in ["NNG", "NNP", "XSN", "SL", "SH", "SN"])
    except Exception as e:
        # print(f"분석 중 오류 발생: {e}")
        return False


# from konlpy.tag import Mecab
# mecab = Mecab(dicpath='C:/mecab/mecab-ko-dic')

# def is_noun_window(keyword: str):
#     pos_tags = mecab.pos(keyword)
#     last_tag = pos_tags[-1][1]
    
#     # 마지막 태그가 명사(NNG, NNP) 또는 명사 파생 접미사(XSN) 또는 외국어(SL) 또는 한자(SH) 또는 숫자(SN)인 경우 True
#     return any(sub in last_tag for sub in ["NNG", "NNP", "XSN", "SL", "SH", "SN"])
