package com.ssafy.backend.domain.archive.enums;

public enum SearchOption {
	ARCHIVE,
	HIGHLIGHT;

	public static SearchOption from(String value) {
		if (value == null || value.isBlank()) {
			return ARCHIVE; // default
		}
		return SearchOption.valueOf(value.toUpperCase());
	}
}
