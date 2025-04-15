package com.ssafy.backend.domain.archive.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.enums.SearchOption;

public interface ArchiveRepositoryCustom {
	Page<Archive> searchByKeyword(
		String email,
		String keyword,
		SearchOption option,
		Pageable pageable
	);
}
