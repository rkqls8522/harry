package com.ssafy.backend.domain.tag.dto.response;

import lombok.Builder;

import com.ssafy.backend.domain.archive.entity.ArchiveTag;
import com.ssafy.backend.domain.tag.entity.TagType;

@Builder
public record TagResponse(
	Long archiveTagId, // archive tag id
	String name,
	Boolean isHierarchical,
	TagType type
) {

	public static TagResponse of(
		Long archiveTagId,
		String name,
		Boolean isHierarchical,
		TagType type
	) {
		return new TagResponse(archiveTagId, name, isHierarchical, type);
	}

	public static TagResponse of(ArchiveTag archiveTag) {
		return new TagResponse(
			archiveTag.getId(),
			archiveTag.getTag().getName(),
			archiveTag.getTag().getIsHierarchical(),
			TagType.ARCHIVE
		);
	}
}
