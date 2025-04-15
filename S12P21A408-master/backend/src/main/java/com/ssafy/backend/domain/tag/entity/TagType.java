package com.ssafy.backend.domain.tag.entity;

import java.util.Arrays;

import lombok.Getter;

@Getter
public enum TagType {
	ARCHIVE("아카이브", 1),
	QUICK_MEMO("간단 메모", 2),
	RECOMMENDATION("추천", 3);

	private final String description;

	private final Integer code;

	TagType(String description, Integer code) {
		this.description = description;
		this.code = code;
	}

	public static TagType of(Integer code) {
		return Arrays.stream(TagType.values())
			.filter(v -> v.getCode().equals(code))
			.findAny()
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그 타입입니다."));
	}
}
