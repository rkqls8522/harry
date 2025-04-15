package com.ssafy.backend.global.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

	private final String SECRET_KEY = "5cBwDJ67eufBN1ZOeClQwYMcSwUe6WGKU8nBzYkW1rTzE5v9Qp4Lm7Ks3JxVo2Hd";
	private final long TOKEN_VALIDITY =
		1000 * 60 * 60 * 24; // 24시간

	private SecretKey getSigningKey() {
		byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(String email, Long memberId) {
		return Jwts.builder()
			.subject(email)
			.claim("memberId", memberId)
			.issuedAt(new Date())
			.expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
			.signWith(getSigningKey())
			.compact();
	}

	public boolean validateToken(String token) {
		try {
			log.info("토큰 검증 시작: {}", token.substring(0, Math.min(10, token.length())));
			Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token);
			log.info("토큰 검증 성공");
			return true;
		} catch (SignatureException e) {
			log.error("잘못된 JWT 서명: {}", e.getMessage());
			return false;
		} catch (MalformedJwtException e) {
			log.error("잘못된 JWT 토큰: {}", e.getMessage());
			return false;
		} catch (ExpiredJwtException e) {
			log.error("만료된 JWT 토큰: {}", e.getMessage());
			return false;
		} catch (UnsupportedJwtException e) {
			log.error("지원되지 않는 JWT 토큰: {}", e.getMessage());
			return false;
		} catch (IllegalArgumentException e) {
			log.error("JWT 토큰이 비어 있음: {}", e.getMessage());
			return false;
		}
	}

	public String getEmailFromToken(String token) {
		Claims claims = Jwts.parser()
			.verifyWith(getSigningKey())
			.build()
			.parseSignedClaims(token)
			.getPayload();

		return claims.getSubject();
	}

	public long getTokenValidity() {
		return TOKEN_VALIDITY;
	}
}