package com.ssafy.backend.domain.platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.backend.domain.platform.entity.Platform;

public interface PlatformRepository extends JpaRepository<Platform, Long> {
}
