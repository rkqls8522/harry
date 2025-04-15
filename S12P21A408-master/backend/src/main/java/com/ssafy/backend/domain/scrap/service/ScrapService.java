package com.ssafy.backend.domain.scrap.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;
import com.ssafy.backend.domain.scrap.dto.ScrapDetailDto;
import com.ssafy.backend.domain.scrap.dto.ScrapDto;
import com.ssafy.backend.domain.scrap.dto.request.SaveScrapRequest;
import com.ssafy.backend.domain.scrap.dto.request.UpdateIsReadRequest;
import com.ssafy.backend.domain.scrap.dto.response.ScrapDetailResponse;
import com.ssafy.backend.domain.scrap.entity.Scrap;
import com.ssafy.backend.domain.scrap.enums.ScrapType;
import com.ssafy.backend.domain.scrap.repository.ScrapRepository;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ScrapService {

	private final ScrapRepository scrapRepository;
	private final MemberRepository memberRepository;

	// TODO: 모든 메서드에 CustomException 적용 예정, 현재는 IllegalArgumentException 사용
	@Transactional
	public ScrapDetailResponse saveScrap(SaveScrapRequest saveScrapRequest, String email) {

		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Scrap scrap = Scrap.builder()
			.title(saveScrapRequest.title())
			.url(saveScrapRequest.url())
			.image(saveScrapRequest.image())
			.isNotified(saveScrapRequest.isNotified())
			.isRead(false)
			.member(member)
			.build();
		scrapRepository.save(scrap);

		return ScrapDetailResponse.from(true, ScrapDetailDto.from(scrap));
	}

	public Page<ScrapDto> getScraps(String email, String type, Pageable pageable) {

		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		ScrapType scrapType = ScrapType.from(type);

		// 조건별 스크랩 조회
		Page<Scrap> scraps = switch (scrapType) {
			case ALL -> scrapRepository.findByMemberEmail(email, pageable);
			case READ -> scrapRepository.findByMemberEmailAndIsRead(email, true, pageable);
			case UNREAD -> scrapRepository.findByMemberEmailAndIsRead(email, false, pageable);
		};

		return scraps.map(ScrapDto::from);
	}

	@Transactional
	public void updateScrapReadStatus(Long scrapId, UpdateIsReadRequest updateIsReadRequest, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));
		Scrap scrap = scrapRepository.findById(scrapId)
			.orElseThrow(() -> new IllegalArgumentException("해당 스크랩이 없습니다."));

		scrap.updateIsRead(updateIsReadRequest.isRead());
	}

	@Transactional
	public void deleteScrap(Long scrapId, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));
		scrapRepository.deleteById(scrapId);
	}

	public ScrapDetailResponse getScrapDetail(String url, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Optional<Scrap> OptionalScrap = scrapRepository.findByUrlAndMemberEmail(url, email);

		return OptionalScrap
			.map(scrap -> ScrapDetailResponse.from(true, ScrapDetailDto.from(scrap)))
			.orElseGet(() -> ScrapDetailResponse.from(false, null));
	}
}
