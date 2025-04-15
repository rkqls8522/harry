package com.ssafy.backend.domain.highlight.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.repository.ArchiveRepository;
import com.ssafy.backend.domain.highlight.dto.request.SaveHighlightRequest;
import com.ssafy.backend.domain.highlight.dto.response.SaveHighlightResponse;
import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.domain.highlight.repository.HighlightRepository;
import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;
import com.ssafy.backend.domain.memo.repository.MemoRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class HighlightService {

	private final HighlightRepository highlightRepository;
	private final ArchiveRepository archiveRepository;
	private final MemberRepository memberRepository;
	private final MemoRepository memoRepository;

	@Transactional
	public SaveHighlightResponse saveHighlight(SaveHighlightRequest request, String email) {
		Archive archive = getOrCreateArchive(request, email);

		Highlight highlight = Highlight.builder()
			.id(request.highlightId())
			.rawContent(request.rawContent())
			.content(request.content())
			.color(request.color())
			.type(request.type())
			.startXpath(request.startXpath())
			.endXpath(request.endXpath())
			.startOffset(request.startOffset())
			.endOffset(request.endOffset())
			.archive(archive)
			.build();

		Highlight result = highlightRepository.save(highlight);

		return SaveHighlightResponse.of(result);
	}

	@Transactional
	public Archive getOrCreateArchive(SaveHighlightRequest request, String email) {
		return archiveRepository.findByUrlAndMember_Email(request.archiveUrl(), email)
			.orElseGet(
				() -> {
					Member member = memberRepository.findByEmail(email)
						.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));
					Archive archive = Archive.builder()
						.title(request.archiveTitle())
						.url(request.archiveUrl())
						.image(request.archiveImage())
						.isPublic(false)
						.member(member)
						.build();
					return archiveRepository.save(archive);
				}
			);
	}

	@Transactional
	public void deleteHighlight(String highlightId, String email) {
		Highlight highlight = highlightRepository.findByIdAndArchive_Member_Email(highlightId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 하이라이트가 없습니다."));

		memoRepository.deleteByHighlightId(highlightId);
		highlightRepository.deleteById(highlightId);
	}
}
