package com.ssafy.backend.domain.gpt.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.gpt.service.ChatGPTService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class ChatGPTController {

	private final ChatGPTService chatGPTService;

	@GetMapping("/recommend/tag/extension")
	public ResponseEntity<ResponseWrapper<List<String>>> chatGPTExtension(
		HttpServletRequest request
	) {
		String rawQueryString = request.getQueryString();

		// 직접 파싱
		String rawUrl = null;
		if (rawQueryString != null && rawQueryString.startsWith("url=")) {
			rawUrl = rawQueryString.substring(4);
		}

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();

		List<String> response = chatGPTService.chatExt(rawUrl, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/recommend/tag/{archiveId}")
	public ResponseEntity<ResponseWrapper<List<String>>> chatGPTBrowser(@PathVariable("archiveId") Long archiveId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();

		List<String> response = chatGPTService.chatBrow(archiveId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}
}
