package com.ssafy.backend.domain.archive.dto.response;

public record ArchiveDatailByUrlResponse(
	Boolean isHighlighted,
	ArchiveDetailResponse archive
) {
	public static ArchiveDatailByUrlResponse of(
		Boolean isHighlighted,
		ArchiveDetailResponse archive
	) {
		return new ArchiveDatailByUrlResponse(
			isHighlighted,
			archive
		);
	}
}