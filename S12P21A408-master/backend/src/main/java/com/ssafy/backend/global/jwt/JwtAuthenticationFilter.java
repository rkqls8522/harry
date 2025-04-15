package com.ssafy.backend.global.jwt;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.global.security.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService userDetailsService;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		String path = request.getRequestURI();
		log.info("현재 경로: {}", path);

		// /api/auth/** 경로는 JWT 인증에서 제외
		return path.startsWith("/api/auth/") ||
			path.startsWith("/oauth2/authorize/") ||
			path.startsWith("/login/oauth2/code/");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {

		// Authorization 헤더에서 JWT 토큰 추출
		String token = extractTokenFromHeader(request);

		// 토큰이 없는 경우
		if (token == null) {
			log.info("JWT 토큰 없음. 토큰 검증 없이 인증 처리: {}", request.getRequestURI());

			filterChain.doFilter(request, response);
			return;
		}

		// 토큰 검증 및 인증 처리
		if (jwtUtil.validateToken(token)) {
			String email = jwtUtil.getEmailFromToken(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(email);

			UsernamePasswordAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
			authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(authentication);

			log.info("인증 성공: {}", email);
			filterChain.doFilter(request, response);
		} else {
			// 토큰이 유효하지 않은 경우
			sendErrorResponse(response, "인증이 만료되었습니다. 다시 로그인해주세요.", HttpStatus.UNAUTHORIZED);
		}
	}

	private String extractTokenFromHeader(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");

		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			// "Bearer " 접두사 제거 (7글자)
			return bearerToken.substring(7);
		}

		return null;
	}

	private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
		response.setStatus(status.value());
		response.setContentType("application/json;charset=UTF-8");

		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("status", status.value());
		errorResponse.put("error", status.getReasonPhrase());
		errorResponse.put("message", message);

		response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
	}
}