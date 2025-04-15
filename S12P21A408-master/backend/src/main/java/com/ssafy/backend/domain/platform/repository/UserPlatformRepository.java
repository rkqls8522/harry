package com.ssafy.backend.domain.platform.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.backend.domain.platform.entity.UserPlatform;

public interface UserPlatformRepository extends JpaRepository<UserPlatform, Long> {
	List<UserPlatform> findByMemberIdOrderByPlatform_NameDesc(Long memberId);

	Optional<UserPlatform> findByMemberIdAndPlatform_PlatformId(Long memberId, Long platformId);
}
