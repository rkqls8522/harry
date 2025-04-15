package com.ssafy.backend.domain.member.controller;

import com.ssafy.backend.domain.member.dto.MemberDto;
import com.ssafy.backend.domain.member.service.MemberService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;

	@GetMapping("/me")
	public ResponseEntity<MemberDto> getCurrentMember() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		MemberDto memberDto = memberService.getMemberByEmail(email);
		return ResponseEntity.ok(memberDto);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletResponse response) {
		// 쿠키 삭제
		Cookie cookie = new Cookie("accessToken", null);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setMaxAge(0); // 즉시 만료

		response.addCookie(cookie);

		// 인증 정보 삭제
		SecurityContextHolder.clearContext();

		return ResponseEntity.ok().build();
	}
}