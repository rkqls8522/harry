package com.ssafy.backend.domain.highlight.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.backend.domain.highlight.dto.request.SaveHighlightRequest;
import com.ssafy.backend.domain.highlight.dto.response.SaveHighlightResponse;
import com.ssafy.backend.domain.highlight.service.HighlightService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class HighlightController {

	private final HighlightService highlightService;

	// TODO: 현재 테스트용 이메일로 member 직접 작성, 추후 JWT에서 사용자 정보 추출하도록 수정

	@PostMapping("/highlights")
	public ResponseEntity<ResponseWrapper<SaveHighlightResponse>> saveHighlight(
		@RequestBody SaveHighlightRequest saveHighlightRequest
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		SaveHighlightResponse response = highlightService.saveHighlight(saveHighlightRequest, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, response);
	}

	@DeleteMapping("/highlights/{highlightId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteHighlight(
		@PathVariable String highlightId
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		highlightService.deleteHighlight(highlightId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}
}
