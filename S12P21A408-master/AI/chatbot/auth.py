import jwt
import datetime
import logging
from dotenv import load_dotenv
import os

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JwtUtil:
    def __init__(self):
        self.SECRET_KEY = os.getenv("SECRET_KEY")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY가 .env 파일에 없습니다.")
        
        self.TOKEN_VALIDITY = 1000 * 60 * 60 * 24  # 24시간 (밀리초 단위)

    def _decode_token(self, token):
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=["HS512"])
            return payload
        except jwt.ExpiredSignatureError:
            logger.error("만료된 JWT 토큰")
            raise ValueError("만료된 토큰입니다.")
        except jwt.InvalidTokenError as e:
            logger.error("잘못된 JWT 토큰: %s", str(e))
            raise ValueError("잘못된 토큰입니다.")
        except Exception as e:
            logger.error(f"토큰 디코딩 오류: {str(e)}")
            raise ValueError("토큰 디코딩 오류입니다.")

    def generate_token(self, email, member_id):
        expiration = datetime.datetime.utcnow() + datetime.timedelta(milliseconds=self.TOKEN_VALIDITY)

        payload = {
            "sub": email,
            "memberId": member_id,
            "iat": datetime.datetime.utcnow(),
            "exp": expiration
        }

        token = jwt.encode(payload, self.SECRET_KEY, algorithm="HS512")
        return token

    def validate_token(self, token):
        try:
            self._decode_token(token)
            logger.info("토큰 검증 성공")
            return True
        except ValueError:
            return False

    def get_email_from_token(self, token):
        try:
            payload = self._decode_token(token)
            email = payload.get("sub")
            if not email:
                raise ValueError("email이 없습니다.")
            return email
        except ValueError as e:
            logger.error(f"Token Error: {str(e)}")
            raise ValueError(f"이메일 추출 중 오류발생. {e}")

    def get_memberId_from_token(self, token):
        try:
            payload = self._decode_token(token)
            member_id = payload.get("memberId")
            if not member_id:
                raise ValueError("memberId가 없습니다.")
            return member_id
        except ValueError as e:
            logger.error(f"Token Error: {str(e)}")
            raise ValueError(f"ID 추출 중 오류 발생. {e}")

    def get_token_validity(self):
        return self.TOKEN_VALIDITY

    def extract_from_header(self, request):
        token = request.headers.get("Authorization")
        if token is None:
            raise ValueError("액세스 토큰이 필요합니다.")
        
        if token.startswith("Bearer "):
            token = token[7:]  # "Bearer " 제거
        
        return token
