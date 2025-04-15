package com.ssafy.backend.global.oauth.service;

import com.ssafy.backend.domain.member.entity.Member;
import com.ssafy.backend.domain.member.repository.MemberRepository;
import com.ssafy.backend.global.oauth.dto.CustomOAuth2User;
import com.ssafy.backend.global.oauth.dto.GoogleResponse;
import com.ssafy.backend.global.oauth.dto.OAuth2Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // 어떤 소셜 로그인인지 확인 (google, naver, kakao 등)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // OAuth2 응답 객체 생성
        OAuth2Response oAuth2Response = createOAuth2Response(registrationId, oauth2User.getAttributes());

        // 사용자 정보 저장 또는 업데이트
        saveOrUpdateMember(oAuth2Response);

        return new CustomOAuth2User(oauth2User);
    }

    private OAuth2Response createOAuth2Response(String registrationId, Map<String, Object> attributes) {
        if ("google".equals(registrationId)) {
            return new GoogleResponse(attributes);
        }
        // 추가 소셜 로그인 서비스를 구현할 경우 여기에 추가

        throw new IllegalArgumentException("Unsupported OAuth2 provider: " + registrationId);
    }

    @Transactional
    public Member saveOrUpdateMember(OAuth2Response response) {
        // 이메일로 사용자 조회
        Optional<Member> existingMember = memberRepository.findByEmail(response.getEmail());

        if (existingMember.isPresent()) {
            // 기존 사용자일 경우 정보 업데이트
            Member member = existingMember.get();
            // 이름이 변경된 경우 업데이트
            if (!member.getName().equals(response.getName())) {
                member.update(response.getName());
            }
            log.info("기존 사용자 로그인: {}", member.getEmail());
            return member;
        } else {
            // 새 사용자일 경우 저장
            Member newMember = Member.builder()
                    .email(response.getEmail())
                    .name(response.getName())
                    .provider(response.getProvider())
                    .build();

            Member savedMember = memberRepository.save(newMember);
            log.info("새 사용자 등록: {}", savedMember.getEmail());
            return savedMember;
        }
    }
}