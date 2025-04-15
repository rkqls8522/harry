package com.ssafy.backend.domain.member.service;

import com.ssafy.backend.domain.member.dto.MemberDto;
import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;

	@Transactional(readOnly = true)
	public MemberDto getMemberByEmail(String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new NoSuchElementException("Member not found with email: " + email));

		return MemberDto.builder()
			.id(member.getId())
			.email(member.getEmail())
			.name(member.getName())
			.provider(member.getProvider())
			.hasVisitRecord(member.getHasVisitRecord())
			.build();
	}
}