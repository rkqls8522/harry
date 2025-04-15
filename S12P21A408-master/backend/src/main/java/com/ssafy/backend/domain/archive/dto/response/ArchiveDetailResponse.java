package com.ssafy.backend.domain.archive.dto.response;

import java.util.List;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.entity.ArchiveTag;
import com.ssafy.backend.domain.highlight.dto.response.HighlightItemResponse;
import com.ssafy.backend.domain.highlight.entity.Highlight;

public record ArchiveDetailResponse(
	Long archiveId,
	String title,
	String url,
	String image,
	Boolean isPublic,
	String note,
	String createdAt,
	List<ArchiveTagResponse> tags,
	List<HighlightItemResponse> highlights
) {
	public static ArchiveDetailResponse of(Archive archive, List<Highlight> highlights, List<ArchiveTag> archiveTags) {
		return new ArchiveDetailResponse(
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
				highlights.stream()
						.map(HighlightItemResponse::of)
						.toList()
		);
	}
}
