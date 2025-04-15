package com.ssafy.backend.domain.memo.entity;

import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.global.common.entity.BaseTimeEntity;

import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Memo extends BaseTimeEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String content;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "highlight_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Highlight highlight;

	// 연관관계 메서드
	public void linkHighlight(Highlight highlight) {
		this.highlight = highlight;
	}

	// 비지니스 로직
	public void update(String content) {
		this.content = content;
	}
}
