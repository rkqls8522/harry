package com.ssafy.backend.domain.archive.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.entity.QArchive;
import com.ssafy.backend.domain.archive.enums.SearchOption;
import com.ssafy.backend.domain.highlight.entity.QHighlight;

@RequiredArgsConstructor
public class ArchiveRepositoryImpl implements ArchiveRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<Archive> searchByKeyword(String email, String keyword, SearchOption option, Pageable pageable) {
		QArchive archive = QArchive.archive;
		QHighlight highlight = QHighlight.highlight;

		List<Archive> content;
		JPAQuery<Long> countQuery;

		switch (option) {
			case HIGHLIGHT:
				content = queryFactory
					.selectDistinct(archive)
					.from(highlight)
					.join(highlight.archive, archive)
					.where(
						archive.member.email.eq(email),
						highlight.content.containsIgnoreCase(keyword)
					)
					.offset(pageable.getOffset())
					.limit(pageable.getPageSize())
					.fetch();

				countQuery = queryFactory
					.select(archive.countDistinct())
					.from(highlight)
					.join(highlight.archive, archive)
					.where(
						archive.member.email.eq(email),
						highlight.content.containsIgnoreCase(keyword)
					);
				break;

			case ARCHIVE:
			default:
				content = queryFactory
					.selectFrom(archive)
					.where(
						archive.member.email.eq(email),
						archive.title.containsIgnoreCase(keyword)
					)
					.offset(pageable.getOffset())
					.limit(pageable.getPageSize())
					.fetch();

				countQuery = queryFactory
					.select(archive.count())
					.from(archive)
					.where(
						archive.member.email.eq(email),
						archive.title.containsIgnoreCase(keyword)
					);
		}

		return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
	}
}
