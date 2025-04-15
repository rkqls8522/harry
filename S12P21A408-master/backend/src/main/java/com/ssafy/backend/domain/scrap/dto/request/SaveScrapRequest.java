package com.ssafy.backend.domain.scrap.dto.request;

public record SaveScrapRequest(
	String url,
	String title,
	String image,
	Boolean isNotified
) {
}
