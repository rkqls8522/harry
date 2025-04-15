package com.ssafy.backend.global.common.dto;

import java.util.Arrays;

import org.springframework.http.HttpStatus;

// ResponseCode 미설정 시 사용할 수 있는 코드 기본값
public enum DefaultResponseCode implements ResponseCode {
	
	OK("200", "HTTP_STATUS_OK", HttpStatus.OK),
	CREATED("201", "HTTP_STATUS_CREATED", HttpStatus.CREATED),
	BAD_REQUEST("400", "HTTP_STATUS_BAD_REQUEST", HttpStatus.BAD_REQUEST),
	UNAUTHORIZED("401", "HTTP_STATUS_UNAUTHORIZED", HttpStatus.UNAUTHORIZED),
	FORBIDDEN("403", "HTTP_STATUS_FORBIDDEN", HttpStatus.FORBIDDEN),
	NOT_FOUND("404", "HTTP_STATUS_NOT_FOUND", HttpStatus.NOT_FOUND),
	INTERNAL_SERVER_ERROR("500", "HTTP_STATUS_INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	DefaultResponseCode(String code, String message, HttpStatus httpStatus) {
		this.code = code;
		this.message = message;
		this.httpStatus = httpStatus;
	}

	@Override
	public String getCode() {
		return this.code;
	}

	@Override
	public String getMessage() {
		return this.message;
	}

	@Override
	public HttpStatus getHttpStatus() {
		return this.httpStatus;
	}

	// HttpStatus 입력 시 Enum 값을 반환해주는 메서드
	static DefaultResponseCode of(HttpStatus httpStatus) {
		return Arrays.stream(DefaultResponseCode.values())
			.filter(defaultResponseCode ->
				defaultResponseCode.getHttpStatus().equals(httpStatus))
			.findFirst()
			.orElse(null);
	}
}
