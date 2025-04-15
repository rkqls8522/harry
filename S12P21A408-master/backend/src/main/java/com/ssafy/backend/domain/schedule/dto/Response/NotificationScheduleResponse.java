package com.ssafy.backend.domain.schedule.dto.Response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import com.ssafy.backend.domain.schedule.entity.Schedule;

@Getter
@Builder
@ToString
public class NotificationScheduleResponse {
	private Long id;
	private Long memberId;
	private LocalDateTime alarmTime;
	private LocalDateTime expireTime;
	private String content;

	public static NotificationScheduleResponse fromEntity(Schedule schedule) {
		return NotificationScheduleResponse.builder()
			.id(schedule.getId())
			.memberId(schedule.getMemberId())
			.alarmTime(schedule.getAlarmTime())
			.expireTime(schedule.getExpireTime())
			.content(schedule.getContent())
			.build();
	}

}
