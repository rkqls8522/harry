package com.ssafy.backend.global.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.backend.global.common.dto.ResponseWrapper;
import com.ssafy.backend.global.common.dto.ResponseWrapperFactory;
import com.ssafy.backend.global.common.exception.BaseException;
import com.ssafy.backend.global.common.exception.BaseRuntimeException;
import com.ssafy.backend.global.common.exception.CustomException;
import com.ssafy.backend.global.common.exception.ExceptionCode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler({BaseException.class, BaseRuntimeException.class})
	public ResponseEntity<ResponseWrapper<Void>> handleException(Exception exception) {
		CustomException customException = exception.getClass().getAnnotation(CustomException.class);

		ExceptionCode exceptionCode = customException.value();

		return ResponseWrapperFactory.setResponse(
			exceptionCode,
			null
		);
	}
}

