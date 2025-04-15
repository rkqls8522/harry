import tldextract
from collections import Counter

def get_top_platforms(json_data):
    def get_full_domain(url):
        ext = tldextract.extract(url)
        if not ext.domain or not ext.suffix:
            raise ValueError(f"유효하지 않은 URL: {url}")
        return f"{ext.domain}.{ext.suffix}"

    full_domains = [get_full_domain(item.url) for item in json_data]
    
    domain_counts = Counter(full_domains)

    # print("도메인별 등장 횟수:")
    # for domain, count in domain_counts.most_common():
    #     print(f"{domain}: {count}회")

    top_5_platforms = domain_counts.most_common(4)

    all_platforms = list(domain_counts.keys())

    return top_5_platforms, all_platforms 
