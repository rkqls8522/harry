package com.ssafy.backend.global.common.entity;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseAuthorEntity {

	@CreatedBy
	@Column(nullable = false, updatable = false, length = 100)
	protected String createdBy;

	@LastModifiedBy
	@Column(nullable = false, length = 100)
	protected String modifiedBy;
}
