package com.ssafy.backend.domain.archive.entity;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.DynamicUpdate;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.global.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@DynamicUpdate
public class Archive extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@Column(length = 1024)
	private String url;

	private String image;

	@Column(name = "is_public")
	private Boolean isPublic = false;

	private String note;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "member_email",
		referencedColumnName = "email",
		foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT)
	)
	private Member member;

	@OneToMany(mappedBy = "archive")
	private List<ArchiveTag> archiveTags = new ArrayList<>();

	public void saveNote(String note) {
		this.note = note;
	}

	public void updateNote(String note) {
		this.note = note;
	}

	public void deleteNote() {
		this.note = null;
	}
}
