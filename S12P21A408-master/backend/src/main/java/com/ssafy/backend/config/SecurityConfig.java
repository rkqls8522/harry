package com.ssafy.backend.config;

import static org.springframework.http.HttpHeaders.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import com.ssafy.backend.global.jwt.JwtAuthenticationFilter;
import com.ssafy.backend.global.oauth.handler.OAuth2LoginSuccessHandler;
import com.ssafy.backend.global.oauth.service.CustomOAuth2UserService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Order(0)
@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
	private final CustomOAuth2UserService customOAuth2UserService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		defaultFilterChain(http);

		return http
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
			.authorizeHttpRequests(authorize ->
				authorize
					.requestMatchers("/api/auth/**").permitAll() // 토큰 발급 test용
					.requestMatchers("/api/**").authenticated()
			)
			.oauth2Login(oauth2 -> oauth2
				.userInfoEndpoint(userInfo -> userInfo
					.userService(customOAuth2UserService)
				)
				.successHandler(oAuth2LoginSuccessHandler)
				.authorizationEndpoint(authorization -> authorization
					.baseUri("/oauth2/authorize")
				)
			)
			.exceptionHandling(exception -> exception
				.authenticationEntryPoint((request, response, authException) -> {
					String requestedFrom = request.getHeader("X-Requested-From");

					if ("extension".equalsIgnoreCase(requestedFrom)) {
						// 크롬 익스텐션 요청
						response.setStatus(HttpStatus.UNAUTHORIZED.value());
						response.setContentType("application/json;charset=UTF-8");
						response.getWriter().write("{\"message\": \"익스텐션: 인증이 필요합니다.\"}");
					} else {
						// 브라우저 요청
						response.setStatus(HttpStatus.UNAUTHORIZED.value());
						response.setContentType("application/json;charset=UTF-8");
						response.getWriter().write("{\"message\": \"웹: 인증이 필요합니다.\"}");
					}
				})
			)
			.build();
	}

	private void defaultFilterChain(HttpSecurity http) throws Exception {
		http.httpBasic(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.csrf(
				csrf -> csrf
					.ignoringRequestMatchers("/api/**")
					.disable()
			)
			.cors(Customizer.withDefaults())
			.sessionManagement(
				session -> session.sessionCreationPolicy(STATELESS)
			);
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		// TODO: local front 테스트 시에만 허용
		configuration.addAllowedOriginPattern("*");

		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");
		configuration.setAllowCredentials(true);
		configuration.addExposedHeader(SET_COOKIE);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}