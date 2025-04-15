package com.ssafy.backend.domain.schedule.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.ssafy.backend.domain.schedule.entity.Schedule;
import com.ssafy.backend.domain.schedule.repository.ScheduleRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;

	public List<Schedule> getSchedulesInNext24Hours(Long memberId, LocalDateTime loginTime) {
		LocalDateTime endTime = loginTime.plusHours(24);

		List<Schedule> schedules = scheduleRepository.findSchedulesInTimeRange(loginTime, endTime, memberId);

		if (schedules.isEmpty()) {
			log.warn("24시간 내 스케줄이 없습니다. 데이터 확인 필요");
		}

		return schedules;
	}
}
