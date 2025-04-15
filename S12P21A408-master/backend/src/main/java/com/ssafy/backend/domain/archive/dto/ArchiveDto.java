package com.ssafy.backend.domain.archive.dto;

import java.time.LocalDateTime;

import com.ssafy.backend.domain.archive.entity.Archive;

public record ArchiveDto(
	Long id,
	String title,
	String url,
	String image,
	Boolean isPublic,
	String note,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
	public static ArchiveDto from(Archive archive) {
		return new ArchiveDto(
			archive.getId(),
			archive.getTitle(),
			archive.getUrl(),
			archive.getImage(),
			archive.getIsPublic(),
			archive.getNote(),
			archive.getCreatedAt(),
			archive.getUpdatedAt()
		);
	}
}
