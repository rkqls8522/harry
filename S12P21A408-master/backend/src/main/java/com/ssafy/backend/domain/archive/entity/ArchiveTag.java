package com.ssafy.backend.domain.archive.entity;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.tag.entity.Tag;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ArchiveTag {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "archive_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Archive archive;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tag_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Tag tag;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "member_email",
		referencedColumnName = "email",
		foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT)
	)
	private Member member;

	public ArchiveTag(Archive archive, Tag tag, Member member) {
		this.archive = archive;
		this.tag = tag;
		this.member = member;
	}
}
