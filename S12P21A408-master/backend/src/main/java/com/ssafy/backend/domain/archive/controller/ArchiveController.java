package com.ssafy.backend.domain.archive.controller;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.archive.dto.ArchiveDto;
import com.ssafy.backend.domain.archive.dto.request.SaveNoteRequest;
import com.ssafy.backend.domain.archive.dto.request.UpdateNoteRequest;
import com.ssafy.backend.domain.archive.dto.response.ArchiveDatailByUrlResponse;
import com.ssafy.backend.domain.archive.dto.response.ArchiveDetailResponse;
import com.ssafy.backend.domain.archive.dto.response.ArchiveResponse;
import com.ssafy.backend.domain.archive.service.ArchiveService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ArchiveController {
	private final ArchiveService archiveService;

	// 아카이브 상세 조회
	@GetMapping("/archives/{archiveId}")
	public ResponseEntity<ResponseWrapper<ArchiveDetailResponse>> getArchive(
		@PathVariable("archiveId") Long archiveId
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		ArchiveDetailResponse response = archiveService.getArchive(archiveId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@PostMapping("/archives/{archiveId}/note")
	public ResponseEntity<ResponseWrapper<ArchiveDto>> saveNote(
		@PathVariable("archiveId") Long archiveId,
		@RequestBody SaveNoteRequest saveNoteRequest
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		ArchiveDto response = archiveService.saveNote(archiveId, saveNoteRequest, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, response);
	}

	@PatchMapping("/archives/{archiveId}/note")
	public ResponseEntity<ResponseWrapper<ArchiveDto>> updateNote(
		@PathVariable("archiveId") Long archiveId,
		@RequestBody UpdateNoteRequest updateNoteRequest
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		ArchiveDto response = archiveService.updateNote(archiveId, updateNoteRequest, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@DeleteMapping("/archives/{archiveId}/note")
	public ResponseEntity<ResponseWrapper<Void>> deleteNote(
		@PathVariable("archiveId") Long archiveId
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		archiveService.deleteNote(archiveId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	// 아카이브 리스트 조회
	@GetMapping("/archives")
	public ResponseEntity<ResponseWrapper<Page<ArchiveResponse>>> getArchives(
		@RequestParam(value = "folderName", required = false) Optional<String> folderName,
		@RequestParam(value = "tagNames", required = false) Optional<List<String>> tagNames,
		@PageableDefault(size = 200, sort = "created_at", direction = Sort.Direction.DESC) Pageable pageable
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		Page<ArchiveResponse> response = archiveService.getArchives(email, folderName, tagNames,
			pageable);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	// 아카이브 상세 조회(익스텐션 - url로 조회)
	@GetMapping("/archives/detail")
	public ResponseEntity<ResponseWrapper<ArchiveDatailByUrlResponse>> getArchiveDetail(
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
		ArchiveDatailByUrlResponse response = archiveService.getArchiveByUrl(rawUrl, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	// 아카이브 검색
	@GetMapping("/archives/search")
	public ResponseEntity<ResponseWrapper<Page<ArchiveResponse>>> getSearchArchives(
		@RequestParam("keyword") String keyword,
		@RequestParam(required = false) String option,
		@PageableDefault(size = 200, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		Page<ArchiveResponse> response = archiveService.searchArchives(email, keyword, option, pageable);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}
}
