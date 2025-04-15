package com.ssafy.backend.domain.highlight.dto.request;

import com.ssafy.backend.domain.highlight.entity.HighlightType;

public record SaveHighlightRequest(
	String highlightId,
	String archiveTitle,
	String archiveUrl,
	String archiveImage,
	String rawContent,
	String content,
	String color,
	HighlightType type,
	String startXpath,
	String endXpath,
	Integer startOffset,
	Integer endOffset
) {
}
