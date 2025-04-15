def build_main_recommendations(search_results):
    recommendations = []

    for item in search_results:
        recommendations.append({
            "title": item["title"],
            "link": item["link"],
            "thumbnail": item["thumbnail"]
        })
    
    
    return recommendations
