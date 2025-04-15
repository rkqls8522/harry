package com.ssafy.backend.domain.tag.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.entity.ArchiveTag;
import com.ssafy.backend.domain.archive.repository.ArchiveRepository;
import com.ssafy.backend.domain.archive.repository.ArchiveTagRepository;
import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;
import com.ssafy.backend.domain.tag.dto.response.TagGroupResponse;
import com.ssafy.backend.domain.tag.dto.response.TagResponse;
import com.ssafy.backend.domain.tag.entity.Tag;
import com.ssafy.backend.domain.tag.entity.TagType;
import com.ssafy.backend.domain.tag.repository.TagRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

	private final MemberRepository memberRepository;
	private final ArchiveRepository archiveRepository;
	private final TagRepository tagRepository;
	private final ArchiveTagRepository archiveTagRepository;

	@Transactional
	public List<TagResponse> saveTag(Long archiveId, String email, String name, Boolean isHierarchical) {
		Archive archive = archiveRepository.findById(archiveId)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 존재하지 않습니다."));
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));

		Optional<Tag> tag = tagRepository.findByName(name);
		ArchiveTag archiveTag = null;
		if (tag.isPresent()) {
			archiveTag = new ArchiveTag(
				archive,
				tag.get(),
				member
			);
		} else {
			Tag newTag = new Tag(name, isHierarchical, TagType.ARCHIVE);
			newTag = tagRepository.save(newTag);

			archiveTag = new ArchiveTag(
				archive,
				newTag,
				member
			);
		}
		archiveTagRepository.save(archiveTag);
		List<ArchiveTag> archiveTags = archiveTagRepository.findByArchiveId(archiveId);
		return archiveTags.stream()
			.map(TagResponse::of)
			.toList();
	}

	public List<TagGroupResponse> getAllMyTags(String email) {
		List<ArchiveTag> archiveTags = archiveTagRepository.findByEmailOrderByName(email);

		// 그룹별 맵 초기화
		Map<String, List<ArchiveTag>> grouped = new LinkedHashMap<>();
		Set<String> tagNameSet = new HashSet<>();

		// A-Z 초기화
		for (char c = 'A'; c <= 'Z'; c++) {
			grouped.put(String.valueOf(c), new ArrayList<>());
		}

		// ㄱ-ㅎ 그룹 키 (초성 리스트)
		List<String> chosungGroup = List.of("ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ");
		for (String ch : chosungGroup) {
			grouped.put(ch, new ArrayList<>());
		}

		for (ArchiveTag archiveTag : archiveTags) {
			Tag tag = archiveTag.getTag();
			String name = tag.getName().toUpperCase();

			// TODO[준]: JAVA 애플리케이션에서 중복 제거 -> 쿼리문으로
			if (tagNameSet.contains(tag.getName()))
				continue;
			tagNameSet.add(tag.getName());

			// 영어 알파벳인지 확인
			char firstChar = name.charAt(0);
			if (firstChar >= 'A' && firstChar <= 'Z') {
				grouped.get(String.valueOf(firstChar)).add(archiveTag);
			} else {
				// 한글 초성 분리
				char hangul = getHangul(name.charAt(0));
				if (grouped.containsKey(String.valueOf(hangul))) {
					grouped.get(String.valueOf(hangul)).add(archiveTag);
				}
			}
		}

		// 최종 response 변환
		return grouped.entrySet().stream()
			.map(entry -> new TagGroupResponse(
				entry.getKey(),
				entry.getValue().stream()
					.map(TagResponse::of)
					.toList())
			)
			.toList();
	}

	public List<TagResponse> getAllHierarchicalTags(String email) {
		List<ArchiveTag> archiveTags = archiveTagRepository.findByEmailAndIsHierarchical(email);
		Set<String> tagNameSet = new HashSet<>();

		return archiveTags.stream()
			.filter(archiveTag -> tagNameSet.add(archiveTag.getTag().getName()))
			.map(TagResponse::of)
			.toList();
	}

	@Transactional
	public void deleteTag(Long archiveTagId) {
		archiveTagRepository.deleteById(archiveTagId);
	}

	public List<TagResponse> getTopTags(String email) {
		List<ArchiveTag> archiveTags = archiveTagRepository.findTopTagsByEmail(email);
		return archiveTags.stream()
			.map(TagResponse::of)
			.toList();
	}

	public List<TagResponse> getTopTagsByTagName(String email, String tagName) {
		List<Long> archiveIds = archiveTagRepository.findArchiveIdsByEmailAndTagName(email, tagName);
		List<ArchiveTag> archiveTags = archiveTagRepository.findTopTagsWithTagName(archiveIds);
		return archiveTags.stream()
			.map(TagResponse::of)
			.toList();
	}

	public List<TagResponse> searchArchiveTags(String email, String keyword) {
		List<ArchiveTag> archiveTags = archiveTagRepository.findByContainsTagName(email, keyword);
		Set<String> tagNameSet = new HashSet<>();
		return archiveTags.stream()
			.filter(archiveTag -> tagNameSet.add(archiveTag.getTag().getName()))
			.map(TagResponse::of)
			.toList();
	}

	public List<TagResponse> getHistory(String email) {
		List<ArchiveTag> archiveTags = archiveTagRepository.findMyHistory(email);
		Set<String> tagNameSet = new HashSet<>();
		return archiveTags.stream()
			.filter(archiveTag -> tagNameSet.add(archiveTag.getTag().getName()))
			.map(TagResponse::of)
			.sorted(
				(a, b) -> {
					if (a.archiveTagId() == null || b.archiveTagId() == null)
						return 0;
					return Long.compare(b.archiveTagId(), a.archiveTagId());
				}
			)
			.toList();
	}

	// 한글 초성 구하기
	private char getHangul(char c) {
		if (c < 0xAC00 || c > 0xD7A3)
			return '?'; // 한글 음절 범위 아님

		String hangulTable = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
		int base = c - 0xAC00;
		int index = base / (21 * 28);
		return hangulTable.charAt(index);
	}
}
