import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from auth import JwtUtil


email = "qnrpxn@gmail.com"
member_id = 9

jwt_util = JwtUtil()

token = jwt_util.generate_token(email, member_id)

print(f"생성된 JWT 토큰: {token}")

