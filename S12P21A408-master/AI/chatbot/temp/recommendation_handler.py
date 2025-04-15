def build_recommendations(search_results):
    recommendations = []

    # 구글 검색 결과에서 제목, 링크, 썸네일을 추출하여 추천 항목 리스트에 추가
    for item in search_results:
        recommendations.append({
            "title": item["title"],
            "link": item["link"],
            "thumbnail": item["thumbnail"]
        })
    
    
    return recommendations
