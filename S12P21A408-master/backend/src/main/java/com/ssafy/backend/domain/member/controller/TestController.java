package com.ssafy.backend.domain.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;

import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.member.dto.MemberDto;
import com.ssafy.backend.domain.member.service.MemberService;
import com.ssafy.backend.global.jwt.JwtUtil;

//TEST용 - 토큰 발급
@Slf4j
@RestController
public class TestController {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private MemberService memberService;

	@GetMapping("/auth/local-login")
	public ResponseEntity<MemberDto> localLogin() {
		// 테스트용 이메일로 새 토큰 생성
		String testEmail = "test@email.com";
		String token = jwtUtil.generateToken(testEmail, 1L);
		log.info("로컬 테스트용 토큰 생성: {}", token.substring(0, Math.min(10, token.length())) + "...");

		// 쿠키에 저장
		ResponseCookie cookie = ResponseCookie.from("accessToken", token)
			.path("/")
			.httpOnly(false)
			.secure(true)
			.maxAge((int)(jwtUtil.getTokenValidity() / 1000))
			.sameSite("None")
			.build();

		log.info("로컬 테스트용 쿠키 설정: {}", cookie.toString());

		// 테스트 계정 정보 반환
		MemberDto memberDto = memberService.getMemberByEmail(testEmail);

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, cookie.toString())
			.body(memberDto);
	}

	@GetMapping("/auth/new-token")
	public ResponseEntity<String> generateNewToken() {
		// 테스트용 이메일로 새 토큰 생성
		String token = jwtUtil.generateToken("test@email.com", 1L);
		log.info("생성된 토큰: {}", token.substring(0, Math.min(10, token.length())) + "...");

		// 쿠키에 저장
		ResponseCookie cookie = ResponseCookie.from("accessToken", token)
			.path("/")
			.httpOnly(false)
			.secure(true)
			.maxAge((int)(jwtUtil.getTokenValidity() / 1000))
			.sameSite("None")
			.build();

		log.info("쿠키 설정: {}", cookie.toString());

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, cookie.toString())
			.body("새 토큰이 발급되었습니다.");
	}
}