package com.ssafy.backend.domain.memo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.backend.domain.memo.entity.Memo;

@Repository
public interface MemoRepository extends JpaRepository<Memo, Long> {
	void deleteByHighlightId(String highlightId);
}
