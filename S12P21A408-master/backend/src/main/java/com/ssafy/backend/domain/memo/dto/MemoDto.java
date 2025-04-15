package com.ssafy.backend.domain.memo.dto;

import com.ssafy.backend.domain.memo.entity.Memo;

public record MemoDto(
	Long id,
	String content
) {
	public static MemoDto from(Memo saveMemo) {
		return new MemoDto(
			saveMemo.getId(),
			saveMemo.getContent()
		);
	}

	public static MemoDto of(Memo memo) {
		return new MemoDto(
				memo.getId(),
				memo.getContent()
		);
	}
}
