package com.ssafy.backend.domain.schedule.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.ssafy.backend.domain.schedule.dto.Response.NotificationScheduleResponse;
import com.ssafy.backend.domain.schedule.entity.Schedule;
import com.ssafy.backend.domain.schedule.service.ScheduleService;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/notification-schedules")
@RequiredArgsConstructor
public class NotificationScheduleController {

	private final ScheduleService scheduleService;

	@GetMapping("/upcoming")
	public ResponseEntity<List<NotificationScheduleResponse>> getUpcomingNotifications(
		@RequestParam("memberId") Long memberId,
		@RequestParam("loginTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime loginTime) {

		List<Schedule> schedules = scheduleService.getSchedulesInNext24Hours(memberId, loginTime);

		List<NotificationScheduleResponse> responses = schedules.stream()
			.map(schedule -> {
				return NotificationScheduleResponse.fromEntity(schedule);
			})
			.collect(Collectors.toList());


		log.info("조회된 알람 스케줄: {}", responses);
		return ResponseEntity.ok(responses);
	}
}
