package com.ssafy.backend.domain.scrap.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.scrap.dto.ScrapDto;
import com.ssafy.backend.domain.scrap.dto.request.SaveScrapRequest;
import com.ssafy.backend.domain.scrap.dto.request.UpdateIsReadRequest;
import com.ssafy.backend.domain.scrap.dto.response.ScrapDetailResponse;
import com.ssafy.backend.domain.scrap.service.ScrapService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class ScrapController {

	private final ScrapService scrapService;

	// 스크랩 사이트 저장
	@PostMapping("/scraps")
	public ResponseEntity<ResponseWrapper<ScrapDetailResponse>> saveScrap(
		@RequestBody SaveScrapRequest saveScrapRequest
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null,
			scrapService.saveScrap(saveScrapRequest, email));
	}

	// 스크랩 사이트 목록 조회
	@GetMapping("/scraps")
	public ResponseEntity<ResponseWrapper<Page<ScrapDto>>> getScraps(
		@RequestParam(value = "type", required = false) String type,
		@PageableDefault(size = 200, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		Page<ScrapDto> response = scrapService.getScraps(email, type, pageable);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	// 스크랩 사이트 읽음 처리
	@PostMapping("/scraps/{scrapId}")
	public ResponseEntity<ResponseWrapper<Void>> updateScrapReadStatus(
		@PathVariable Long scrapId,
		@RequestBody UpdateIsReadRequest updateIsReadRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		scrapService.updateScrapReadStatus(scrapId, updateIsReadRequest, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	// 스크랩 사이트 삭제
	@DeleteMapping("/scraps/{scrapId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteScrap(
		@PathVariable Long scrapId
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		scrapService.deleteScrap(scrapId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	@GetMapping("/scraps/detail")
	public ResponseEntity<ResponseWrapper<ScrapDetailResponse>> getScrapDetail(
		@RequestParam(value = "url") String url
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, scrapService.getScrapDetail(url, email));
	}
}
