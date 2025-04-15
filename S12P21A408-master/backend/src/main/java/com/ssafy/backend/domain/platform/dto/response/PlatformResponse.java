package com.ssafy.backend.domain.platform.dto.response;

import java.util.List;

import com.ssafy.backend.domain.platform.dto.PlatformDto;

public record PlatformResponse(
	List<PlatformDto> platforms
) {
	public static PlatformResponse of(List<PlatformDto> platforms) {
		return new PlatformResponse(platforms);
	}
}
