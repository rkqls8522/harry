package com.ssafy.backend.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
	private Long id;
	private String email;
	private String name;
	private String provider;
	private Boolean hasVisitRecord;
}
