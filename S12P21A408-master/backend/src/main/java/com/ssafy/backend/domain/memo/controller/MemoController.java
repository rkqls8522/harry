package com.ssafy.backend.domain.memo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.backend.domain.memo.dto.MemoDto;
import com.ssafy.backend.domain.memo.dto.request.SaveMemoRequest;
import com.ssafy.backend.domain.memo.dto.request.UpdateMemoRequest;
import com.ssafy.backend.domain.memo.service.MemoService;
import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemoController {

	private final MemoService memoService;

	@PostMapping("/highlights/{highlightId}/memos")
	public ResponseEntity<ResponseWrapper<MemoDto>> saveMemo(
		@PathVariable String highlightId,
		@RequestBody SaveMemoRequest saveMemoRequest
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null,
			memoService.saveMemo(highlightId, saveMemoRequest, email));
	}

	@PatchMapping("/highlights/{highlightId}/memos/{memoId}")
	public ResponseEntity<ResponseWrapper<MemoDto>> updateMemo(
		@PathVariable String highlightId,
		@PathVariable Long memoId,
		@RequestBody UpdateMemoRequest updateMemoRequest
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null,
			memoService.updateMemo(highlightId, memoId, updateMemoRequest, email));
	}

	@DeleteMapping("/highlights/{highlightId}/memos/{memoId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteMemo(
		@PathVariable String highlightId,
		@PathVariable Long memoId
	) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		memoService.deleteMemo(highlightId, memoId, email);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}
}
