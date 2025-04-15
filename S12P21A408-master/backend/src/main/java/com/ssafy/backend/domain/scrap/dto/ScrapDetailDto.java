package com.ssafy.backend.domain.scrap.dto;

import com.ssafy.backend.domain.scrap.entity.Scrap;

public record ScrapDetailDto(
	Long id,
	String title,
	String url,
	String image,
	Boolean isRead,
	Boolean isNotified
) {
	public static ScrapDetailDto from(Scrap scrap) {
		return new ScrapDetailDto(
			scrap.getId(),
			scrap.getTitle(),
			scrap.getUrl(),
			scrap.getImage(),
			scrap.getIsRead(),
			scrap.getIsNotified()
		);
	}
}