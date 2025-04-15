package com.ssafy.backend.domain.archive.dto.response;

import java.util.List;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.entity.ArchiveTag;

public record ArchiveResponse(
	Long archiveId,
	String title,
	String url,
	String image,
	Boolean isPublic,
	String note,
	String createdAt,
	List<ArchiveTagResponse> tags, // TODO[지]: tags 임시로 빈리스트 반환, 추후 TagResponse 수정,
	HighlightInfo highlightInfo
) {

	public record HighlightInfo(
		int count,
		List<String> colors
	) {
	}

	public static ArchiveResponse of(Archive archive, List<ArchiveTag> archiveTags, HighlightInfo highlightInfo) {
		return new ArchiveResponse(
			archive.getId(),
			archive.getTitle(),
			archive.getUrl(),
			archive.getImage(),
			archive.getIsPublic(),
			archive.getNote(),
			archive.getCreatedAt().toString(),
			archiveTags.stream()
				.map(ArchiveTagResponse::of)
				.toList(),
			highlightInfo
		);
	}
}
