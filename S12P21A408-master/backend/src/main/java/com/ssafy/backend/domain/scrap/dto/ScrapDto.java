package com.ssafy.backend.domain.scrap.dto;

import java.time.LocalDateTime;

import com.ssafy.backend.domain.scrap.entity.Scrap;

public record ScrapDto(
	Long id,
	String title,
	String url,
	String image,
	Boolean isRead,
	Boolean isNotified,
	LocalDateTime createdAt
) {
	public static ScrapDto from(Scrap scrap) {
		return new ScrapDto(
			scrap.getId(),
			scrap.getTitle(),
			scrap.getUrl(),
			scrap.getImage(),
			scrap.getIsRead(),
			scrap.getIsNotified(),
			scrap.getCreatedAt()
		);
	}
}
