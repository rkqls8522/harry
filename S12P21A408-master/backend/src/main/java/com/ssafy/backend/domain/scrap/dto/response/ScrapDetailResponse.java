package com.ssafy.backend.domain.scrap.dto.response;

import com.ssafy.backend.domain.scrap.dto.ScrapDetailDto;

public record ScrapDetailResponse(
	Boolean isScrapped,
	ScrapDetailDto scrap
) {
	public static ScrapDetailResponse from(
		Boolean isScrapped,
		ScrapDetailDto scrap
	) {
		return new ScrapDetailResponse(isScrapped, scrap);
	}
}