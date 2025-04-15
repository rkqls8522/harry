package com.ssafy.backend.global.oauth.handler;

import com.ssafy.backend.domain.member.service.MemberService;
import com.ssafy.backend.global.jwt.JwtUtil;
import com.ssafy.backend.global.oauth.dto.CustomOAuth2User;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtUtil jwtUtil;
	private final MemberService memberService;
	private final String FRONTEND_URL = "https://j12a408.p.ssafy.io/?login=success";
	private final String DOMAIN = "j12a408.p.ssafy.io";

	/* 프론트엔드 서버로 JWT를 전달할 때 Cookie 방식 사용 */
	private String createCookie(String key, String value) {
		ResponseCookie cookie = ResponseCookie.from(key, value)
			.path("/")
			.sameSite("None")
			.httpOnly(false)
			.domain(DOMAIN)
			.secure(true)
			.maxAge(jwtUtil.getTokenValidity() / 1000)
			.build();

		return cookie.toString();
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {
		CustomOAuth2User oAuth2User = (CustomOAuth2User)authentication.getPrincipal();
		String email = oAuth2User.getEmail();

		Long memberId = memberService.getMemberByEmail(email).getId();
		String token = jwtUtil.generateToken(email, memberId);

		// 새로운 방식으로 쿠키 생성 및 추가
		String cookieHeader = createCookie("accessToken", token);
		response.addHeader("Set-Cookie", cookieHeader);

		log.info("JWT 토큰이 쿠키에 저장되었습니다. 이메일: {}", oAuth2User.getEmail());

		// 프론트엔드로 리다이렉트 (토큰을 URL에 포함하지 않음) //TODO[지우]: accessToken 재발급 후 현재 있던 페이지로 다시 가는 것
		getRedirectStrategy().sendRedirect(request, response, FRONTEND_URL);
	}
}