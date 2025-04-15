package com.ssafy.backend.domain.highlight.dto.response;

import java.time.LocalDateTime;

import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.domain.highlight.entity.HighlightType;

public record SaveHighlightResponse(
	String highlightId,
	String rawContent,
	String content,
	String color,
	HighlightType type,
	String startXpath,
	String endXpath,
	Integer startOffset,
	Integer endOffset,
	Long archiveId,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
	public static SaveHighlightResponse of(Highlight highlight) {
		return new SaveHighlightResponse(
			highlight.getId(),
			highlight.getRawContent(),
			highlight.getContent(),
			highlight.getColor(),
			highlight.getType(),
			highlight.getStartXpath(),
			highlight.getEndXpath(),
			highlight.getStartOffset(),
			highlight.getEndOffset(),
			highlight.getArchive().getId(),
			highlight.getCreatedAt(),
			highlight.getUpdatedAt()
		);
	}
}
