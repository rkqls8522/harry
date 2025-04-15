package com.ssafy.backend.domain.tag.controller;

import java.util.List;
import java.util.Optional;

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
import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.tag.dto.request.TagForArchiveRequest;
import com.ssafy.backend.domain.tag.dto.response.TagGroupResponse;
import com.ssafy.backend.domain.tag.dto.response.TagResponse;
import com.ssafy.backend.domain.tag.service.TagService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TagController {

	private final TagService tagService;

	@PostMapping("/archives/{archiveId}/tags")
	public ResponseEntity<ResponseWrapper<List<TagResponse>>> createArchiveTag(
		@PathVariable("archiveId") Long archiveId,
		@RequestBody TagForArchiveRequest request
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		List<TagResponse> response = tagService.saveTag(archiveId, email, request.name(), request.isHierarchical());
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	// 사전순으로 태그 이름 정렬해서 반환
	@GetMapping("/tags/all")
	public ResponseEntity<ResponseWrapper<List<TagGroupResponse>>> getAllTags() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		List<TagGroupResponse> response = tagService.getAllMyTags(email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/tags/hierarchical")
	public ResponseEntity<ResponseWrapper<List<TagResponse>>> getAllHierarchicalTags() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		List<TagResponse> response = tagService.getAllHierarchicalTags(email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@DeleteMapping("/tags/{archiveTagId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteArchiveTag(@PathVariable("archiveTagId") Long archiveTagId) {
		tagService.deleteTag(archiveTagId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	@GetMapping("/tags/top")
	public ResponseEntity<ResponseWrapper<List<TagResponse>>> getTopTags(
		@RequestParam(required = false) Optional<String> tagName) {
		// TODO[준]: Security 에서 가져오기 & Validation tagName 에 `/` 들어가야함
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		if (tagName.isEmpty()) {
			List<TagResponse> response = tagService.getTopTags(email);
			return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
		} else {
			List<TagResponse> response = tagService.getTopTagsByTagName(email, tagName.get());
			return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
		}
	}

	@GetMapping("/tags/search")
	public ResponseEntity<ResponseWrapper<List<TagResponse>>> getArchiveTags(
		@RequestParam(required = false) Optional<String> keyword
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		List<TagResponse> response = tagService.searchArchiveTags(email, keyword.orElse(""));
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/tags/history")
	public ResponseEntity<ResponseWrapper<List<TagResponse>>> getHistory() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		List<TagResponse> response = tagService.getHistory(email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}
}
