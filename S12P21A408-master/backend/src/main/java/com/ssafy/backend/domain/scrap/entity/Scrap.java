package com.ssafy.backend.domain.scrap.entity;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.global.common.entity.BaseTimeEntity;

@Entity
@Getter
@Builder
@Table(name = "scrap", uniqueConstraints = {
	@UniqueConstraint(name = "uq_scrap_member_url", columnNames = {"member_email", "url"})
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Scrap extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private String url;

	private String image;

	@Column(name = "is_read", nullable = false)
	private Boolean isRead = false;

	@Column(name = "is_notified")
	private Boolean isNotified;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "member_email",
		referencedColumnName = "email",
		foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT)
	)
	private Member member;

	public void updateIsRead(Boolean isRead) {
		this.isRead = isRead;
	}
}
