from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from auth import JwtUtil
from chat.gemini import process_gemini_request
from chat.schedule_api import router as schedule_router
from chat.memo_api import router as memo_router
from recommend.recommendation import get_recommendations
from recommend.main_recommendation import get_main_recommendations
from history.history_keyword import process_histories_keywords
from typing import List, Optional

app = FastAPI(prefix="/ai")
jwt_util = JwtUtil()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schedule_router)
app.include_router(memo_router)

class PageInfo(BaseModel):
    url: Optional[str] = None
    title: Optional[str] = None 
    image: Optional[str] = None
    isNotified: Optional[bool] = False

class ChatMessage(BaseModel):
    message: str
    pageInfo: Optional[PageInfo] = None

@app.post("/ai/chat")
async def chat_endpoint(chat_message: ChatMessage, request: Request):

    try:
        token = jwt_util.extract_from_header(request)
        
        member_id = jwt_util.get_memberId_from_token(token)
        
    except ValueError as e:
        return response(401, str(e))
    
    
    response = process_gemini_request(member_id, chat_message.message, chat_message.pageInfo, token)
    return response


def response(code: int, message: str, content: dict = None):
    return JSONResponse(status_code=code, content={
        "status": {"code": str(code), "message": message},
        "content": content if content else {}
    })

def check_required_field(field_value, field_name):
    if not field_value:
        return JSONResponse(status_code=400, content={
            "status": {"code": "400", "message": f"No {field_name} provided"},
            "content": {}
        })


class URLRequest(BaseModel):
    url: str

@app.post("/ai/recommendations")
async def recommendations_endpoint(request: Request, data: URLRequest):

    try:
        token = jwt_util.extract_from_header(request)
        
        member_id = jwt_util.get_memberId_from_token(token)
        
    except ValueError as e:
        return response(401, str(e))
    
    
    url = data.url
    err = check_required_field(url, "url")
    if err:
        return err
    
    result = get_recommendations(member_id, url)
    return response(result["code"], result["message"], result["content"])



class MainRecommendationsRequest(BaseModel):
    keywords: list[str]  # 최소 1개 이상의 키워드
    platform: str


@app.get("/ai/main/recommendations")
async def main_recommendations_endpoint(
    keywords: List[str] = Query(..., description="List of keywords"),
    platform: str = Query(..., description="Platform name"),
    offset: int = Query(1, description="offset for pagination, default is 1")):

    # err = check_required_field(keywords, "keywords")
    # if err:
    #     return err
    
    if all(keyword == "" for keyword in keywords):
        return response(400, "빈 키워드만으로는 추천할 수 없습니다.")
   
    err = check_required_field(platform, "platform")
    if err:
        return err
    
    if offset <= 0:
        offset = 1

    result = get_main_recommendations(keywords, platform, offset)
    return response(result["code"], result["message"], result["content"])


class HistoryKeywordsRequest(BaseModel):
    url: str
    title: str
    timestamp: str

@app.post("/ai/histories/keywords")
async def histories_keywords_endpoint(request: Request, data: list[HistoryKeywordsRequest]):
    if not data:
        return response(200, "처리할 데이터가 없습니다")

    try:
        token = jwt_util.extract_from_header(request)
        member_id = jwt_util.get_memberId_from_token(token)
    except ValueError as e:
        return response(401, str(e))
    
    result = process_histories_keywords(data, member_id)
    return response(result["code"], result["message"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)