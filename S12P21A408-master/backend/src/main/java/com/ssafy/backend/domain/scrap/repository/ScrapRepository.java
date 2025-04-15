package com.ssafy.backend.domain.scrap.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.backend.domain.scrap.entity.Scrap;

@Repository
public interface ScrapRepository extends JpaRepository<Scrap, Long> {

	@Query("SELECT s FROM Scrap s WHERE s.member.email = :email")
	Page<Scrap> findByMemberEmail(@Param("email") String email, Pageable pageable);

	Optional<Scrap> findByUrlAndMemberEmail(String url, String email);

	@Query(value = "SELECT s FROM Scrap s "
		+ "WHERE s.member.email = :email "
		+ "AND s.isRead = :isRead")
	Page<Scrap> findByMemberEmailAndIsRead(
		@Param("email") String email,
		@Param("isRead") Boolean isRead,
		Pageable pageable
	);
}
