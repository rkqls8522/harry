package com.ssafy.backend.domain.archive.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.archive.dto.ArchiveDto;
import com.ssafy.backend.domain.archive.dto.request.SaveNoteRequest;
import com.ssafy.backend.domain.archive.dto.request.UpdateNoteRequest;
import com.ssafy.backend.domain.archive.dto.response.ArchiveDatailByUrlResponse;
import com.ssafy.backend.domain.archive.dto.response.ArchiveDetailResponse;
import com.ssafy.backend.domain.archive.dto.response.ArchiveResponse;
import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.entity.ArchiveTag;
import com.ssafy.backend.domain.archive.enums.SearchOption;
import com.ssafy.backend.domain.archive.repository.ArchiveRepository;
import com.ssafy.backend.domain.archive.repository.ArchiveTagRepository;
import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.domain.highlight.repository.HighlightRepository;
import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ArchiveService {

	private final ArchiveRepository archiveRepository;
	private final MemberRepository memberRepository;
	private final HighlightRepository highlightRepository;
	private final ArchiveTagRepository archiveTagRepository;

	// 아카이브 상세 조회
	public ArchiveDetailResponse getArchive(Long archiveId, String email) {

		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Archive archive = archiveRepository.findByIdAndMember_Email(archiveId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 없습니다."));

		List<Highlight> highlights = highlightRepository.findByArchiveIdOrderByUpdatedAtAsc(archiveId);

		List<ArchiveTag> archiveTags = archiveTagRepository.findByArchiveId(archiveId);

		return ArchiveDetailResponse.of(archive, highlights, archiveTags);
	}

	// 아카이브 리스트 조회
	public Page<ArchiveResponse> getArchives(
		String email,
		Optional<String> folderName,
		Optional<List<String>> tagNames,
		Pageable pageable
	) {

		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Page<Archive> archives;
		if (folderName.isEmpty() && tagNames.isEmpty()) {
			// 아카이브 전체 조회
			archives = archiveRepository.findByMember_Email(email, pageable);
		} else if (folderName.isPresent() && tagNames.isEmpty()) {
			// 폴더 이름으로 아카이브 조회
			archives = archiveRepository.findByFolderTagName(email, folderName.get(), pageable);
		} else if (folderName.isEmpty()) {
			// 태그 이름으로 아카이브 조회
			archives = archiveRepository.findByTagNames(email, tagNames.get(), pageable);
		} else {
			// 폴더 이름과 태그 이름으로 아카이브 조회
			archives = archiveRepository.findByFolderNameAndAnyTagName(
				email,
				folderName.get(),
				tagNames.get(),
				pageable
			);
		}

		return toArchiveResponsePage(archives);
	}

	@Transactional
	public ArchiveDto saveNote(Long archiveId, SaveNoteRequest saveNoteRequest, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Archive archive = archiveRepository.findByIdAndMember_Email(archiveId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 없습니다."));

		archive.saveNote(saveNoteRequest.note());

		return ArchiveDto.from(archive);
	}

	@Transactional
	public ArchiveDto updateNote(Long archiveId, UpdateNoteRequest updateNoteRequest, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Archive archive = archiveRepository.findByIdAndMember_Email(archiveId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 없습니다."));

		archive.updateNote(updateNoteRequest.note());

		return ArchiveDto.from(archive);
	}

	@Transactional
	public void deleteNote(Long archiveId, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Archive archive = archiveRepository.findByIdAndMember_Email(archiveId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 없습니다."));

		archive.deleteNote();
	}

	public ArchiveDatailByUrlResponse getArchiveByUrl(String url, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Optional<Archive> optionalArchive = archiveRepository.findByUrlAndMemberEmail(url, email);

		return optionalArchive
			.map(archive -> {
				List<Highlight> highlights = highlightRepository.findByArchiveIdOrderByUpdatedAtAsc(archive.getId());
				List<ArchiveTag> archiveTags = archiveTagRepository
					.findByArchiveId(archive.getId());

				return ArchiveDatailByUrlResponse.of(
					true,
					ArchiveDetailResponse.of(archive, highlights, archiveTags)
				);
			})
			.orElseGet(() -> ArchiveDatailByUrlResponse.of(false, null));
	}

	// 검색
	public Page<ArchiveResponse> searchArchives(String email, String keyword, String optionStr, Pageable pageable) {
		SearchOption option = SearchOption.from(optionStr);
		Page<Archive> archives = archiveRepository.searchByKeyword(email, keyword, option, pageable);

		return toArchiveResponsePage(archives);
	}

	private Page<ArchiveResponse> toArchiveResponsePage(Page<Archive> archives) {
		List<Long> archiveIds = archives.stream()
			.map(Archive::getId)
			.toList();

		List<Highlight> highlights = highlightRepository.findByArchiveIdIn(archiveIds);

		return archives.map(archive -> {
			List<ArchiveTag> archiveTags = archiveTagRepository.findByArchiveId(archive.getId());

			List<Highlight> archiveHighlights = highlights.stream()
				.filter(highlight -> highlight
					.getArchive()
					.getId()
					.equals(archive.getId())
				)
				.toList();

			ArchiveResponse.HighlightInfo highlightInfo = new ArchiveResponse.HighlightInfo(
				archiveHighlights.size(),
				archiveHighlights.stream()
					.map(Highlight::getColor)
					.distinct()
					.toList()
			);

			return ArchiveResponse.of(archive, archiveTags, highlightInfo);
		});
	}

}
