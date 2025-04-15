package com.ssafy.backend.domain.highlight.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.domain.highlight.entity.HighlightType;
import com.ssafy.backend.domain.memo.dto.MemoDto;

public record HighlightItemResponse(
	String highlightId,
	String rawContent,
	String content,
	String color,
	HighlightType type,
	String startXpath,
	String endXpath,
	Integer startOffset,
	Integer endOffset,
	LocalDateTime createdAt,
	LocalDateTime updatedAt,
	List<MemoDto> memos
) {
	public static HighlightItemResponse of(Highlight highlight) {
		return new HighlightItemResponse(
			highlight.getId(),
			highlight.getRawContent(),
			highlight.getContent(),
			highlight.getColor(),
			highlight.getType(),
			highlight.getStartXpath(),
			highlight.getEndXpath(),
			highlight.getStartOffset(),
			highlight.getEndOffset(),
			highlight.getCreatedAt(),
			highlight.getUpdatedAt(),
			highlight.getMemos().stream()
				.map(MemoDto::of)
				.toList()
		);
	}
}
