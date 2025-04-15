package com.ssafy.backend.domain.schedule.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "schedules")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Schedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "member_id", nullable = false)
	private Long memberId;

	@Column(nullable = false)
	private String content;

	@Column(name = "expire_time", nullable = false)
	private LocalDateTime expireTime;

	@Column(name = "alarm_time", nullable = false)
	private LocalDateTime alarmTime;

	@Column(name = "alarm_sent", nullable = false)
	private Boolean alarmSent = false;

	// 생성자
	public Schedule(Long memberId, String content, LocalDateTime expireTime, LocalDateTime alarmTime) {
		this.memberId = memberId;
		this.content = content;
		this.expireTime = expireTime;
		this.alarmTime = alarmTime;
	}

	// 알람 발송 표시 메서드
	public void markAsAlarmSent() {
		this.alarmSent = true;
	}
}