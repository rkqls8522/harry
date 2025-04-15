package com.ssafy.backend.domain.archive.dto.response;

import com.ssafy.backend.domain.archive.entity.ArchiveTag;

public record ArchiveTagResponse(
	Long id,
	String name,
	Boolean isHierarchical
) {

	static ArchiveTagResponse of(
		ArchiveTag archiveTag
	) {
		return new ArchiveTagResponse(
			archiveTag.getId(),
			archiveTag.getTag().getName(),
			archiveTag.getTag().getIsHierarchical()
		);
	}
}
