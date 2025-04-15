// src/components/ScheduleDetail/ScheduleDetail.jsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './ScheduleDetail.css';

const ScheduleDetail = ({ schedule, onEdit, onDelete, onClose }) => {
  // 디버깅을 위해 스케줄 데이터 로깅
  console.log('ScheduleDetail에 전달된 schedule:', schedule);

  // 일정 삭제 처리
  const handleDelete = async () => {
    // 삭제 확인 모달
    const confirmDelete = window.confirm('정말로 이 일정을 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await onDelete(schedule.id);
        onClose(); // 삭제 후 모달 닫기
      } catch (err) {
        console.error('일정 삭제 오류:', err);
        // 필요하다면 사용자에게 에러 메시지 표시
        window.alert('일정 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 일정 수정 처리
  const handleEdit = () => {
    onEdit(schedule);
  };

  // 요일을 한국어로 반환하는 함수
  const getKoreanWeekday = (date) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[date.getDay()];
  };

  // 날짜 형식화 함수 - 표준 JavaScript Date 객체 사용
  const formatDateWithWeekday = (dateString) => {
    try {
      const date = new Date(dateString);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }

      // 년, 월, 일, 요일, 시간을 직접 포맷팅
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth()는 0부터 시작
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const weekday = getKoreanWeekday(date);

      return `${year}년 ${month}월 ${day}일 (${weekday}) ${hours}:${minutes}`;
    } catch (error) {
      console.error('날짜 형식화 오류:', error, dateString);
      return '날짜 정보 없음';
    }
  };

  // 모든 가능한 필드명을 시도하여 접근 (snake_case와 camelCase 모두)
  const getExpireTime = () => {
    // 가능한 모든 키 이름 시도
    if (schedule.expire_time) return schedule.expire_time;
    if (schedule.expire_time) return schedule.expire_time;
    if (schedule.expire_time) return schedule.expire_time;
    return null;
  };

  const getAlarmTime = () => {
    if (schedule.alarm_time) return schedule.alarm_time;
    if (schedule.alarm_time) return schedule.alarm_time;
    if (schedule.alarm_time) return schedule.alarm_time;
    return null;
  };

  const expire_time = getExpireTime();
  const alarm_time = getAlarmTime();

  return (
    <div className="schedule-detail">
      <h2 className="detail-title">일정 상세</h2>

      <div className="detail-content">
        <p>{schedule.content}</p>
      </div>

      <div className="detail-info">
        <div className="info-group">
          <span className="info-label">일정 시간:</span>
          <span className="info-value">{expire_time ? formatDateWithWeekday(expire_time) : '날짜 정보 없음'}</span>
        </div>

        <div className="info-group">
          <span className="info-label">알림 시간:</span>
          <span className="info-value">{alarm_time ? formatDateWithWeekday(alarm_time) : '날짜 정보 없음'}</span>
        </div>
      </div>

      <div className="detail-actions">
        <button className="edit-btn" onClick={handleEdit}>
          <Edit size={20} />
          수정하기
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          <Trash2 size={20} />
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default ScheduleDetail;
