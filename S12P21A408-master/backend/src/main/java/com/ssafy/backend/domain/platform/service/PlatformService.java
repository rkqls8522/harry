package com.ssafy.backend.domain.platform.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;
import com.ssafy.backend.domain.platform.dto.PlatformDto;
import com.ssafy.backend.domain.platform.dto.response.PlatformResponse;
import com.ssafy.backend.domain.platform.entity.Platform;
import com.ssafy.backend.domain.platform.entity.UserPlatform;
import com.ssafy.backend.domain.platform.repository.PlatformRepository;
import com.ssafy.backend.domain.platform.repository.UserPlatformRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class PlatformService {

	private final UserPlatformRepository userPlatformRepository;
	private final PlatformRepository platformRepository;
	private final MemberRepository memberRepository;

	public PlatformResponse getPlatformData(Long memberId) {

		List<PlatformDto> platforms = userPlatformRepository.findByMemberIdOrderByPlatform_NameDesc(memberId).stream()
			.map(userPlatform -> PlatformDto.from(userPlatform.getPlatform()))
			.toList();

		return PlatformResponse.of(platforms);
	}

	public void deletePlatform(Long memberId, Long platformId, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Platform platform = platformRepository.findById(platformId)
			.orElseThrow(() -> new IllegalArgumentException("해당 플랫폼이 없습니다."));

		UserPlatform userPlatform = userPlatformRepository.findByMemberIdAndPlatform_PlatformId(memberId, platformId)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 선택한 플랫폼이 없습니다."));

		userPlatformRepository.delete(userPlatform);
	}

	public PlatformResponse savePlatform(Long memberId, Long platformId, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Platform platform = platformRepository.findById(platformId)
			.orElseThrow(() -> new IllegalArgumentException("해당 플랫폼이 없습니다."));

		UserPlatform userPlatform = UserPlatform.builder()
			.member(member)
			.platform(platform)
			.build();

		userPlatformRepository.save(userPlatform);

		List<PlatformDto> platforms = userPlatformRepository.findByMemberIdOrderByPlatform_NameDesc(memberId).stream()
			.map(up -> PlatformDto.from(up.getPlatform()))
			.toList();

		return PlatformResponse.of(platforms);
	}

	public PlatformResponse getAllPlatforms() {
		List<PlatformDto> platforms = platformRepository.findAll().stream()
			.map(PlatformDto::from)
			.toList();
		return PlatformResponse.of(platforms);
	}
}
