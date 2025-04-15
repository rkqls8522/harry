package com.ssafy.backend.domain.gpt.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.archive.entity.Archive;
import com.ssafy.backend.domain.archive.repository.ArchiveRepository;
import com.ssafy.backend.domain.highlight.entity.Highlight;
import com.ssafy.backend.domain.highlight.repository.HighlightRepository;
import com.ssafy.backend.domain.member.repository.MemberRepository;

@Service
@RequiredArgsConstructor
public class ChatGPTService {

	private final RestTemplate restTemplate;

	private final ArchiveRepository archiveRepository;
	private final HighlightRepository highlightRepository;

	public List<String> chatExt(String rawUrl, String email) {
		Archive archive = archiveRepository.findByUrlAndMemberEmail(rawUrl, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 없습니다."));

		return getMessage(archive);
	}

	public List<String> chatBrow(Long archiveId, String email) {
		Archive archive = archiveRepository.findByIdAndMember_Email(archiveId, email)
			.orElseThrow(() -> new IllegalArgumentException("해당 아카이브가 없습니다."));

		return getMessage(archive);
	}

	private List<String> getMessage(Archive archive) {
		List<Highlight> highlights = highlightRepository.findByArchive_Id(archive.getId());
		StringBuilder message = new StringBuilder("제목: " + archive.getTitle() + "\n");
		message.append("문장들: ");
		for (Highlight highlight : highlights) {
			message.append(highlight.getContent()).append("\n");
		}

		return chat(message.toString());
	}

	// 메시지 입력받고 챗gpt의 응답을 리턴하는 메서드
	public List<String> chat(String message) {

		HttpHeaders headers = new HttpHeaders(); // HTTP 헤더 생성
		headers.setContentType(MediaType.APPLICATION_JSON); // 요청 본문 타입 설정
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON)); // 수신할 응답 타입 설정
		String apiKey = "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";
		headers.set("Authorization", "Bearer " + apiKey); // 인증 헤더에 API 키 추가

		JSONObject messageSystem = new JSONObject(); // 시스템 메시지 JSON 객체 생성
		messageSystem.put("role", "system");  // 역할 설정
		messageSystem.put("content",
			"너는 아래에 주어진 \\\"제목\\\"과 \\\"문장들\\\"을 참고하여 가장 중요한 키워드 3개를 추출하는 역할이야\\n- 반드시 명사(Noun) 형태로만 추출해.\\n- 각 키워드는 영어 혹은 한국어로 제공해.\\n- 핵심 명사만 뽑아.\\n- 예시는 제공하지 않아. 출력 형식만 준수해.\\n\\n**출력 형식:**\\nKeyword1, Keyword2, Keyword3"); // 시스템 메시지 추가

		JSONObject messageUser = new JSONObject(); // 사용자 메시지 JSON 객체 생성
		messageUser.put("role", "user"); // 역할 설정
		messageUser.put("content", message); // 사용자 메시지 추가

		JSONObject requestBody = new JSONObject(); // 요청 본문을 위한 JSON 객체 생성
		requestBody.put("model", "gpt-4o"); // 사용할 모델 설정
		requestBody.put("messages", new JSONArray(Arrays.asList(messageSystem, messageUser))); // 메시지 배열 추가

		HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers); // HTTP 요청 엔티티 생성

		String apiEndpoint = "https://api.openai.com/v1/chat/completions"; // API 엔드포인트 설정
		try {
			ResponseEntity<String> response = restTemplate.postForEntity(apiEndpoint, request, String.class);

			if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
				JSONObject responseBody = new JSONObject(response.getBody());
				// content 추출
				String content = responseBody
					.getJSONArray("choices")
					.getJSONObject(0)
					.getJSONObject("message")
					.getString("content")
					.trim();
				return Arrays.stream(content.split(","))
					.map(String::trim)
					.toList();
			} else {
				return List.of(""); // 응답이 실패한 경우 빈 문자열 반환
			}
		} catch (Exception e) {
			throw new IllegalArgumentException("chatGPT API 호출 중 오류 발생", e); // 예외 발생 시 메시지 반환
		}
	}
}
