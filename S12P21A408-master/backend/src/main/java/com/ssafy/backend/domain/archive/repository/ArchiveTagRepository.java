package com.ssafy.backend.domain.archive.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.backend.domain.archive.entity.ArchiveTag;

public interface ArchiveTagRepository extends JpaRepository<ArchiveTag, Long> {

	@Query(value = "SELECT DISTINCT at FROM ArchiveTag at " +
		"JOIN FETCH at.archive a " +
		"JOIN FETCH at.tag t " +
		"WHERE a.id = :archiveId ",
		countQuery = "SELECT COUNT(DISTINCT at) FROM ArchiveTag at " +
			"JOIN at.archive a " +
			"JOIN FETCH at.tag t " +
			"WHERE a.id = :archiveId "
	)
	List<ArchiveTag> findByArchiveId(@Param("archiveId") Long archiveId);

	@Query(value = "SELECT DISTINCT at FROM ArchiveTag at " +
		"JOIN FETCH at.tag t " +
		"WHERE at.member.email = :email AND t.type = 1 AND t.isHierarchical=false " +
		"ORDER BY t.name",
		countQuery = "SELECT COUNT(DISTINCT at) FROM ArchiveTag at " +
			"JOIN at.tag t " +
			"WHERE at.member.email = :email AND t.type = 1 AND t.isHierarchical=false"
	)
	List<ArchiveTag> findByEmailOrderByName(@Param("email") String email);

	@Query(value = "SELECT DISTINCT at FROM ArchiveTag at " +
		"JOIN FETCH at.tag t " +
		"WHERE at.member.email = :email AND t.type = 1 AND t.isHierarchical=true " +
		"ORDER BY t.name",
		countQuery = "SELECT COUNT(DISTINCT at) FROM ArchiveTag at " +
			"JOIN at.tag t " +
			"WHERE at.member.email = :email AND t.type = 1 AND t.isHierarchical=true"
	)
	List<ArchiveTag> findByEmailAndIsHierarchical(@Param("email") String email);

	@Query(value = "SELECT at FROM ArchiveTag at " +
		"JOIN FETCH at.tag t " +
		"WHERE at.member.email = :email AND t.type = 1 AND t.isHierarchical=false " +
		"GROUP BY t.name " +
		"ORDER BY COUNT(at.id) DESC " +
		"LIMIT 10"
	)
	List<ArchiveTag> findTopTagsByEmail(@Param("email") String email);

	@Query(value = "SELECT DISTINCT at.archive.id FROM ArchiveTag at " +
		"JOIN at.tag t " +
		"WHERE at.member.email = :email AND t.type = 1 AND t.name = :tagName"
	)
	List<Long> findArchiveIdsByEmailAndTagName(@Param("email") String email, @Param("tagName") String tagName);

	@Query(value = "SELECT DISTINCT at FROM ArchiveTag at " +
		"JOIN FETCH at.archive a " +
		"JOIN FETCH at.tag t " +
		"WHERE a.id IN :archiveIds AND t.isHierarchical = false " +
		"GROUP BY t.name " +
		"ORDER BY COUNT(at.id) DESC " +
		"LIMIT 10"
	)
	List<ArchiveTag> findTopTagsWithTagName(@Param("archiveIds") List<Long> archiveIds);

	@Query(value = "SELECT DISTINCT at FROM ArchiveTag at " +
		"JOIN FETCH at.tag t " +
		"WHERE at.member.email = :email AND t.type = 1 AND t.name LIKE %:keyword% "
	)
	List<ArchiveTag> findByContainsTagName(@Param("email") String email, @Param("keyword") String keyword);

	@Query(value = "SELECT DISTINCT at FROM ArchiveTag at " +
		"JOIN FETCH at.tag t " +
		"WHERE at.member.email = :email AND t.type = 1 AND t.isHierarchical=false " +
		"ORDER BY t.name"
	)
	List<ArchiveTag> findMyHistory(String email);
}
