FROM python:3.10-slim

# 작업 디렉토리 생성
WORKDIR /app

# 기본 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tzdata \
        g++ \
        git \
        curl \
        default-jdk \
        default-jre \
        make \
        sudo \
        unzip \
    && apt-get clean

# locale 설정 (한글 데이터 인코딩 오류 방지)
ENV LANG=C.UTF-8
ENV LANGUAGE=C.UTF-8
ENV LC_ALL=C.UTF-8

# requirements 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# mecab start
RUN curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh | bash -s
# mecab end

# 전체 소스 복사
COPY . .

# uvicorn 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]