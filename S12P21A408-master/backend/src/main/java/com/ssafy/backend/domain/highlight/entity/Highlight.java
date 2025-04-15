package com.ssafy.backend.domain.highlight.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.memo.entity.Memo;
import com.ssafy.backend.global.common.entity.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Highlight extends BaseTimeEntity {
	
	@Id
	@Column(name = "id", length = 100)
	private String id;

	private String rawContent;

	private String content;

	private String color;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private HighlightType type;

	private String startXpath;

	private String endXpath;

	private Integer startOffset;

	private Integer endOffset;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "archive_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Archive archive;

	@OneToMany(mappedBy = "highlight", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Memo> memos = new ArrayList<>();

	@Builder
	public Highlight(String id, String rawContent, String content, String color, HighlightType type, String startXpath,
		String endXpath, Integer startOffset, Integer endOffset, Archive archive) {
		this.id = id;
		this.rawContent = rawContent;
		this.content = content;
		this.color = color;
		this.type = type;
		this.startXpath = startXpath;
		this.endXpath = endXpath;
		this.startOffset = startOffset;
		this.endOffset = endOffset;
		this.archive = archive;
	}

	// 연관관계 메서드
	public void addMemo(Memo memo) {
		memos.add(memo);
		memo.linkHighlight(this);
	}
}
