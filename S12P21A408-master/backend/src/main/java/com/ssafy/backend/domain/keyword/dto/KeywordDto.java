package com.ssafy.backend.domain.keyword.dto;

import com.ssafy.backend.domain.keyword.entity.UserKeyword;

public record KeywordDto(
	Long id,
	String keyword,
	int cnt
) {
	public static KeywordDto from(UserKeyword userKeyword) {
		return new KeywordDto(
			userKeyword.getId(),
			userKeyword.getKeyword(),
			userKeyword.getCnt()
		);
	}
}