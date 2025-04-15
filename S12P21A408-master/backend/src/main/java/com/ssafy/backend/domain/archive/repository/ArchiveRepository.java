package com.ssafy.backend.domain.archive.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.backend.domain.archive.entity.Archive;

@Repository
public interface ArchiveRepository extends JpaRepository<Archive, Long>, ArchiveRepositoryCustom {

	Optional<Archive> findByUrlAndMember_Email(String url, String memberEmail);

	Optional<Archive> findByIdAndMember_Email(Long archiveId, String email);

	@Query(value = """
		SELECT * 
		FROM archive 
		WHERE member_email = :email
		ORDER BY created_at DESC
		""",
		countQuery = """
			SELECT COUNT(*) 
			FROM archive 
			WHERE member_email = :email
			""",
		nativeQuery = true)
	Page<Archive> findByMember_Email(String email, Pageable pageable);

	@Query("SELECT a FROM Archive a WHERE a.url = :url AND a.member.email = :email")
	Optional<Archive> findByUrlAndMemberEmail(String url, String email);

	@Query(
		value = """
			    SELECT a.* 
			    FROM archive a
			    JOIN archive_tag at ON a.id = at.archive_id
			    JOIN tag t ON at.tag_id = t.id
			    WHERE a.member_email = :email
			    AND t.name = :folderName
			    AND t.is_hierarchical = true
			    ORDER BY a.created_at DESC
			""",
		countQuery = """
			    SELECT COUNT(*) 
			    FROM (
			        SELECT a.id
			        FROM archive a
			        JOIN archive_tag at ON a.id = at.archive_id
			        JOIN tag t ON at.tag_id = t.id
			        WHERE a.member_email = :email
			        AND t.name = :folderName
			        AND t.is_hierarchical = true
			    ) AS sub
			""",
		nativeQuery = true
	)
	Page<Archive> findByFolderTagName(
		@Param("email") String email,
		@Param("folderName") String folderName,
		Pageable pageable
	);

	@Query(
		value = """
			    SELECT DISTINCT a.* 
			    FROM archive a
			    JOIN archive_tag at ON a.id = at.archive_id
			    JOIN tag t ON at.tag_id = t.id
			    WHERE a.member_email = :email
			    AND t.type = 1
			    AND t.name IN (:tagNames)
			    AND t.is_hierarchical = false
			    ORDER BY a.created_at DESC
			""",
		countQuery = """
			    SELECT COUNT(*) 
			    FROM (
			        SELECT DISTINCT a.id
			        FROM archive a
			        JOIN archive_tag at ON a.id = at.archive_id
			        JOIN tag t ON at.tag_id = t.id
			        WHERE a.member_email = :email
			        AND t.type = 1
			        AND t.name IN (:tagNames)
			        AND t.is_hierarchical = false
			    ) AS sub
			""",
		nativeQuery = true
	)
	Page<Archive> findByTagNames(
		@Param("email") String email,
		@Param("tagNames") List<String> tagNames,
		Pageable pageable
	);

	@Query(value = """
		SELECT a.*
		FROM archive a
		JOIN archive_tag at ON a.id = at.archive_id
		JOIN tag t ON at.tag_id = t.id
		WHERE a.member_email = :email
		AND (
		    t.name = :folderName
		    OR
		    t.name IN (:tagNames)
		)
		GROUP BY a.id
		HAVING 
		    SUM(CASE WHEN t.name = :folderName THEN 1 ELSE 0 END) > 0
		    AND
		    SUM(CASE WHEN t.name IN (:tagNames) THEN 1 ELSE 0 END) > 0
		""",
		countQuery = """
				SELECT COUNT(*) FROM (
					SELECT a.id
					FROM archive a
					JOIN archive_tag at ON a.id = at.archive_id
					JOIN tag t ON at.tag_id = t.id
					WHERE a.member_email = :email
					AND (
					    t.name = :folderName
					    OR t.name IN (:tagNames)
					)
					GROUP BY a.id
					HAVING 
					    SUM(CASE WHEN t.name = :folderName THEN 1 ELSE 0 END) > 0
					    AND
					    SUM(CASE WHEN t.name IN (:tagNames) THEN 1 ELSE 0 END) > 0
				) AS sub
			""",
		nativeQuery = true)
	Page<Archive> findByFolderNameAndAnyTagName(
		@Param("email") String email,
		@Param("folderName") String folderName,
		@Param("tagNames") List<String> tagNames,
		Pageable pageable
	);
}
