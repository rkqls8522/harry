package com.ssafy.backend.domain.platform.dto;

import com.ssafy.backend.domain.platform.entity.Platform;

public record PlatformDto(
	Long platformId,
	String name
) {
	public static PlatformDto from(Platform platform) {
		return new PlatformDto(
			platform.getPlatformId(),
			platform.getName()
		);
	}
}
