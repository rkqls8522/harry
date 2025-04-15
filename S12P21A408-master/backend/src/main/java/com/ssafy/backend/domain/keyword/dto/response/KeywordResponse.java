package com.ssafy.backend.domain.keyword.dto.response;

import java.util.List;

import com.ssafy.backend.domain.keyword.dto.KeywordDto;

public record KeywordResponse(
	List<KeywordDto> keywords
) {
	public static KeywordResponse of(List<KeywordDto> keywords) {
		return new KeywordResponse(keywords);
	}
}
