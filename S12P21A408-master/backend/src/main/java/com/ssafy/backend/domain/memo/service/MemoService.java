package com.ssafy.backend.domain.memo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.domain.highlight.repository.HighlightRepository;
import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;
import com.ssafy.backend.domain.memo.dto.MemoDto;
import com.ssafy.backend.domain.memo.dto.request.SaveMemoRequest;
import com.ssafy.backend.domain.memo.dto.request.UpdateMemoRequest;
import com.ssafy.backend.domain.memo.entity.Memo;
import com.ssafy.backend.domain.memo.repository.MemoRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemoService {

	private final MemoRepository memoRepository;
	private final MemberRepository memberRepository;
	private final HighlightRepository highlightRepository;

	@Transactional
	public MemoDto saveMemo(String highlightId, SaveMemoRequest saveMemoRequest, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Highlight highlight = highlightRepository.findByIdAndArchive_Member_Email(highlightId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 하이라이트가 없습니다."));

		Memo memo = Memo.builder()
			.content(saveMemoRequest.content())
			.highlight(highlight)
			.build();

		return MemoDto.from(memoRepository.save(memo));
	}

	@Transactional
	public MemoDto updateMemo(String highlightId, Long memoId, UpdateMemoRequest updateMemoRequest, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Highlight highlight = highlightRepository.findByIdAndArchive_Member_Email(highlightId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 하이라이트가 없습니다."));

		Memo memo = memoRepository.findById(memoId)
			.orElseThrow(() -> new IllegalArgumentException("해당 메모가 없습니다."));

		memo.update(updateMemoRequest.content());

		return MemoDto.from(memo);
	}

	@Transactional
	public void deleteMemo(String highlightId, Long memoId, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("해당 멤버가 없습니다."));

		Highlight highlight = highlightRepository.findByIdAndArchive_Member_Email(highlightId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 하이라이트가 없습니다."));

		Memo memo = memoRepository.findById(memoId)
			.orElseThrow(() -> new IllegalArgumentException("해당 메모가 없습니다."));

		// 메모 작성자 권한 검증
		String ownerEmail = memo.getHighlight().getArchive().getMember().getEmail();
		if (!ownerEmail.equals(email)) {
			throw new IllegalArgumentException("해당 메모에 대한 권한이 없습니다.");
		}

		memoRepository.deleteById(memoId);
	}
}
