package com.ssafy.backend.domain.schedule.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.backend.domain.schedule.entity.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	@Query("SELECT s FROM Schedule s " +
	       "WHERE s.alarmTime >= :startTime " +
	       "AND s.alarmTime < :endTime " +
		   "AND s.memberId = :memberId")
	List<Schedule> findSchedulesInTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime, @Param("memberId") Long memberId);


}
