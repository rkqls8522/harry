package com.ssafy.backend.domain.platform.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.member.service.MemberService;
import com.ssafy.backend.domain.platform.dto.response.PlatformResponse;
import com.ssafy.backend.domain.platform.service.PlatformService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;
import com.ssafy.backend.global.jwt.JwtUtil;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PlatformController {
	private final PlatformService platformService;
	private final MemberService memberService;
	private final JwtUtil jwtUtil;

	@GetMapping("/recommend/platforms")
	public ResponseEntity<ResponseWrapper<PlatformResponse>> getPlatforms(
		@RequestHeader("Authorization") String authorizationHeader
	) {
		String token = authorizationHeader.replace("Bearer ", "");
		String email = jwtUtil.getEmailFromToken(token);
		Long memberId = memberService.getMemberByEmail(email).getId();
		PlatformResponse response = platformService.getPlatformData(memberId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@DeleteMapping("/recommend/platforms/{platformId}")
	public ResponseEntity<ResponseWrapper<Void>> deletePlatform(
		@RequestHeader("Authorization") String authorizationHeader,
		@PathVariable Long platformId
	) {
		String token = authorizationHeader.replace("Bearer ", "");
		String email = jwtUtil.getEmailFromToken(token);
		Long memberId = memberService.getMemberByEmail(email).getId();
		platformService.deletePlatform(memberId, platformId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	@GetMapping("/recommend/platforms/{platformId}")
	public ResponseEntity<ResponseWrapper<PlatformResponse>> savePlatform(
		@RequestHeader("Authorization") String authorizationHeader,
		@PathVariable Long platformId
	) {
		String token = authorizationHeader.replace("Bearer ", "");
		String email = jwtUtil.getEmailFromToken(token);
		Long memberId = memberService.getMemberByEmail(email).getId();
		PlatformResponse response = platformService.savePlatform(memberId, platformId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/recommend/platforms/all")
	public ResponseEntity<ResponseWrapper<PlatformResponse>> getAllPlatforms(
	) {
		PlatformResponse response = platformService.getAllPlatforms();
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

}
