package com.ssafy.backend.domain.highlight.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.backend.domain.highlight.entity.Highlight;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, String> {
	@Query(value = "SELECT DISTINCT h FROM Highlight h " +
		"LEFT JOIN FETCH h.memos m " +
		"WHERE h.archive.id = :archiveId " +
		"ORDER BY h.updatedAt ASC",
		countQuery = "SELECT COUNT(DISTINCT h) FROM Highlight h " +
			"LEFT JOIN h.memos m " +
			"WHERE h.archive.id = :archiveId " +
			"ORDER BY h.updatedAt ASC"
	)
	List<Highlight> findByArchiveIdOrderByUpdatedAtAsc(@Param("archiveId") Long archiveId);

	Optional<Highlight> findByIdAndArchive_Member_Email(String highlightId, String email);

	List<Highlight> findByArchiveIdIn(List<Long> archiveIds);

	List<Highlight> findByArchive_Id(Long archiveId);
}
