package com.ssafy.backend.domain.member.entity;

import com.ssafy.backend.global.common.entity.BaseTimeEntity;

import jakarta.persistence.*;
import lombok.Builder;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor
public class Member extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "email")
	private String email;

	@Column(name = "name")
	private String name;

	@Column(name = "provider")
	private String provider;

	@Column(name = "has_visit_record")
	private Boolean hasVisitRecord = false;

	@Builder
	public Member(Long id, String email, String name, String provider) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.provider = provider;
	}

	// 회원 정보 업데이트
	public void update(String name) {
		this.name = name;
	}

	public void updateVisitRecord() {
		this.hasVisitRecord = true;
	}
}