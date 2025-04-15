package com.ssafy.backend.domain.scrap.enums;

public enum ScrapType {
	ALL, READ, UNREAD;

	public static ScrapType from(String type) {
		if (type == null || type.isBlank()) {
			return ALL;
		}
		return ScrapType.valueOf(type.toUpperCase());
	}
}
