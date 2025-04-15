// src/components/ScheduleForm/ScheduleForm.jsx
import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { Save, X } from 'lucide-react';
import './ScheduleForm.css';
import useAuthStore from '../../store/authStore';

const ScheduleForm = ({ date, existingSchedule, onSave, onCancel }) => {
  const { user } = useAuthStore();

  // 알림 옵션 정의
  const alarmOptions = [
    { value: 'sameDay', label: '이벤트 당일 (오전 9시)' },
    { value: 'dayBefore', label: '1일 전 (오전 9시)' },
    { value: 'twoDaysBefore', label: '2일 전 (오전 9시)' },
    { value: 'weekBefore', label: '1주일 전 (오전 9시)' },
    { value: 'fiveMinBefore', label: '5분 전' },
    { value: 'tenMinBefore', label: '10분 전' },
  ];

  // 기존 일정 또는 새 일정의 초기 데이터 설정
  const initialData = existingSchedule || {
    content: '',
    expire_time: date ? new Date(date) : new Date(),
    alarm_time: date ? new Date(date) : new Date(),
  };

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    content: initialData.content,
    expireDate: format(new Date(initialData.expire_time), 'yyyy-MM-dd'),
    expire_time: format(new Date(initialData.expire_time), 'HH:mm'),
    alarmOption: 'sameDay', // 기본값: 이벤트 당일 (오전 9시)
  });

  // 초기 알림 옵션 결정 (기존 일정의 경우)
  useEffect(() => {
    if (existingSchedule) {
      const expire_time = new Date(existingSchedule.expire_time);
      const alarm_time = new Date(existingSchedule.alarm_time);

      // 알림 시간과 만료 시간의 차이에 따라 알맞은 옵션 선택
      const diffMinutes = Math.round((expire_time - alarm_time) / (1000 * 60));

      let selectedOption = 'sameDay';

      if (diffMinutes === 5) {
        selectedOption = 'fiveMinBefore';
      } else if (diffMinutes === 10) {
        selectedOption = 'tenMinBefore';
      } else {
        const diffDays = Math.round((expire_time - alarm_time) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          selectedOption = 'dayBefore';
        } else if (diffDays === 2) {
          selectedOption = 'twoDaysBefore';
        } else if (diffDays === 7) {
          selectedOption = 'weekBefore';
        }
      }

      setFormData((prev) => ({
        ...prev,
        alarmOption: selectedOption,
      }));
    }
  }, [existingSchedule]);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 알림 시간 계산 함수 - 수정 버전
  const calculateAlarmTime = (expireDateTime, alarmOption) => {
    let alarm_time;
    const expireDate = new Date(expireDateTime);

    switch (alarmOption) {
      case 'sameDay':
        // 이벤트 당일 오전 9시
        alarm_time = new Date(expireDate);
        alarm_time.setHours(9, 0, 0, 0);

        // 만약 알림 시간이 만료 시간보다 이후라면 알림을 10분 전으로 설정
        if (alarm_time >= expireDate) {
          alarm_time = new Date(expireDate);
          alarm_time.setMinutes(alarm_time.getMinutes() - 10);
        }
        break;
      case 'dayBefore':
        // 1일 전 오전 9시
        alarm_time = new Date(expireDate);
        alarm_time.setDate(alarm_time.getDate() - 1);
        alarm_time.setHours(9, 0, 0, 0);
        break;
      case 'twoDaysBefore':
        // 2일 전 오전 9시
        alarm_time = new Date(expireDate);
        alarm_time.setDate(alarm_time.getDate() - 2);
        alarm_time.setHours(9, 0, 0, 0);
        break;
      case 'weekBefore':
        // 1주일 전 오전 9시
        alarm_time = new Date(expireDate);
        alarm_time.setDate(alarm_time.getDate() - 7);
        alarm_time.setHours(9, 0, 0, 0);
        break;
      case 'fiveMinBefore':
        // 5분 전
        alarm_time = new Date(expireDate);
        alarm_time.setMinutes(alarm_time.getMinutes() - 5);
        break;
      case 'tenMinBefore':
        // 10분 전
        alarm_time = new Date(expireDate);
        alarm_time.setMinutes(alarm_time.getMinutes() - 10);
        break;
      default:
        // 기본값: 이벤트 당일 오전 9시 (단, 만료 시간 이전인지 확인)
        alarm_time = new Date(expireDate);
        alarm_time.setHours(9, 0, 0, 0);

        if (alarm_time >= expireDate) {
          alarm_time = new Date(expireDate);
          alarm_time.setMinutes(alarm_time.getMinutes() - 10);
        }
    }

    return alarm_time;
  };

  // 일정 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 입력 데이터 검증
      if (!formData.content.trim()) {
        throw new Error('일정 내용을 입력해주세요.');
      }

      // date-fns를 사용하여 문자열을 Date 객체로 변환
      // 로컬 시간 기준으로 파싱
      const expireDateTime = parse(`${formData.expireDate} ${formData.expire_time}`, 'yyyy-MM-dd HH:mm', new Date());

      // 유효한 날짜인지 확인
      if (isNaN(expireDateTime.getTime())) {
        throw new Error('유효한 날짜와 시간을 입력해주세요.');
      }

      // 알림 시간 계산
      const alarmDateTime = calculateAlarmTime(expireDateTime, formData.alarmOption);

      // 알람 시간이 만료 시간 이후인지 확인
      if (alarmDateTime > expireDateTime) {
        throw new Error('알림 시간은 일정 시간 이전이어야 합니다.');
      }

      // date-fns의 format 함수를 사용하여 일관된 형식으로 변환
      // 백엔드에서 이해할 수 있는 형식으로 변환
      const scheduleData = {
        member_id: user.id,
        content: formData.content,
        expire_time: format(expireDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
        alarm_time: format(alarmDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      // 부모 컴포넌트의 onSave 콜백 호출
      await onSave(scheduleData);
    } catch (err) {
      setError(err.message || '일정을 저장하는 중 오류가 발생했습니다.');
      console.error('폼 제출 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-form-container">
      <h2 className="form-title">{existingSchedule ? '일정 수정' : '새 일정 추가'}</h2>

      <form onSubmit={handleSubmit} className="schedule-form">
        {error && (
          <div className="form-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="content">일정 내용</label>
          <input
            type="text"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="일정 내용을 입력하세요"
            required
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expireDate">날짜</label>
            <input
              type="date"
              id="expireDate"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expire_time">시간</label>
            <input
              type="time"
              id="expire_time"
              name="expire_time"
              value={formData.expire_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="alarmOption">알림 설정</label>
          <select
            id="alarmOption"
            name="alarmOption"
            value={formData.alarmOption}
            onChange={handleChange}
            className="alarm-select"
            required
          >
            {alarmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>
            <X size={20} />
            취소
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            <Save size={20} />
            {loading ? '저장 중...' : existingSchedule ? '수정하기' : '추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
