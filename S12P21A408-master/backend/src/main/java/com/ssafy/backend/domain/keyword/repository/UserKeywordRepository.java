package com.ssafy.backend.domain.keyword.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.backend.domain.keyword.entity.UserKeyword;

public interface UserKeywordRepository extends JpaRepository<UserKeyword, Long> {
	@Query(value = "SELECT * FROM user_keyword WHERE member_id = :memberId AND keyword NOT LIKE '%s12%' ORDER BY cnt DESC LIMIT 10", nativeQuery = true)
	List<UserKeyword> findTop10ByMemberIdExcludingKeyword(Long memberId);

	List<UserKeyword> findByMemberId(Long memberId);
}
