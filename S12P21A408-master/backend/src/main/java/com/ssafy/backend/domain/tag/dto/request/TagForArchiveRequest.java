package com.ssafy.backend.domain.tag.dto.request;

public record TagForArchiveRequest(
	String name,
	Boolean isHierarchical
) {
}
