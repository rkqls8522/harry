package com.ssafy.backend.domain.keyword.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_keyword")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserKeyword {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private long memberId;

	private String keyword;

	private int cnt;

}

