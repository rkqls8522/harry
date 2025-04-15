package com.ssafy.backend.domain.tag.dto.response;

import java.util.List;

public record TagGroupResponse(
	String group,
	List<TagResponse> tags
) {

	public static TagGroupResponse of(String group, List<TagResponse> tags) {
		return new TagGroupResponse(group, tags);
	}
}
