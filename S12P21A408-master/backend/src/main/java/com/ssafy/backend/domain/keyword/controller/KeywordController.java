package com.ssafy.backend.domain.keyword.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.keyword.dto.response.KeywordResponse;
import com.ssafy.backend.domain.keyword.service.KeywordService;
import com.ssafy.backend.domain.member.service.MemberService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;
import com.ssafy.backend.global.jwt.JwtUtil;

@Slf4j
@RestController
@RequiredArgsConstructor
public class KeywordController {
	private final KeywordService keywordService;
	private final MemberService memberService;
	private final JwtUtil jwtUtil;

	@GetMapping("/recommend/keywords")
	public ResponseEntity<ResponseWrapper<KeywordResponse>> getKeywords(
		@RequestHeader("Authorization") String authorizationHeader
	) {
		String token = authorizationHeader.replace("Bearer ", "");
		String email = jwtUtil.getEmailFromToken(token);
		Long memberId = memberService.getMemberByEmail(email).getId();
		KeywordResponse response = keywordService.getKeywordData(memberId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/recommend/keywords/all")
	public ResponseEntity<ResponseWrapper<KeywordResponse>> getAllKeywords(
		@RequestHeader("Authorization") String authorizationHeader
	) {
		String token = authorizationHeader.replace("Bearer ", "");
		String email = jwtUtil.getEmailFromToken(token);
		Long memberId = memberService.getMemberByEmail(email).getId();
		log.info("userId : {}", memberId);
		KeywordResponse response = keywordService.getAllKeywords(memberId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

}
