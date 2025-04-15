package com.ssafy.backend.global.common.dto;

import org.springframework.http.HttpStatus;

public interface ResponseCode {
	
	String getCode();

	String getMessage();

	HttpStatus getHttpStatus();
}
