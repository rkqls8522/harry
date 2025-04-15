package com.ssafy.backend.global.common.exception;

import org.springframework.http.HttpStatus;

import com.ssafy.backend.global.common.dto.ResponseCode;

public enum ExceptionCode implements ResponseCode {

	INVALID_ACCESS_TOKEN("A0001", "Invalid Access Token", HttpStatus.UNAUTHORIZED);

	private String code;
	private String message;
	private HttpStatus status;

	ExceptionCode(String code, String message, HttpStatus status) {
		this.code = code;
		this.message = message;
		this.status = status;
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
		return this.status;
	}
}
