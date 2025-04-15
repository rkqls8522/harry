package com.ssafy.backend.domain.keyword.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.keyword.dto.KeywordDto;
import com.ssafy.backend.domain.keyword.dto.response.KeywordResponse;
import com.ssafy.backend.domain.keyword.repository.UserKeywordRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KeywordService {

	private final UserKeywordRepository userKeywordRepository;

	public KeywordResponse getKeywordData(Long memberId) {

		List<KeywordDto> keywords = userKeywordRepository.findTop10ByMemberIdExcludingKeyword(memberId).stream()
			.map(KeywordDto::from)
			.toList();

		return KeywordResponse.of(keywords);
	}

	public KeywordResponse getAllKeywords(Long memberId) {
		List<KeywordDto> keywords = userKeywordRepository.findByMemberId(memberId).stream()
			.map(KeywordDto::from)
			.toList();

		return KeywordResponse.of(keywords);
	}
}
