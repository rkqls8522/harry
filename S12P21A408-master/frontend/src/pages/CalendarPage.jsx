// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import useAuthStore from '../store/authStore';
import useScheduleStore from '../store/scheduleStore';
import Modal from '../components/Modal/Modal';
import ScheduleForm from '../components/ScheduleForm/ScheduleForm';
import ScheduleDetail from '../components/ScheduleDetail/ScheduleDetail';
import './CalendarPage.css';

const CalendarPage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // 변경된 부분: AuthContext 대신 authStore 사용
  const { user, isAuthenticated } = useAuthStore();

  // scheduleStore에서 필요한 상태와 함수 가져오기
  const { schedules, loading, error, fetchSchedules, addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();

  // 일정 데이터 가져오기
  useEffect(() => {
    console.log('user from authStore:', user);
    console.log('isAuthenticated:', isAuthenticated);

    if (user) {
      console.log('Fetching schedules for user');
      fetchSchedules();
    } else {
      console.log('No user, skipping schedule fetch');
    }
  }, [user, isAuthenticated, fetchSchedules]);

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 오늘 날짜로 이동하는 함수
  const goToToday = () => {
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  // 달력 헤더 렌더링
  const renderHeader = () => {
    const dateFormat = 'yyyy년 M월';
    const isTodaySelected = isToday(selectedDate); // 선택된 날짜가 오늘인지 확인

    return (
      <div className="calendar-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="month-nav prev" onClick={prevMonth}>
              &lt;
            </button>
            <h2 className="current-month">{format(currentMonth, dateFormat)}</h2>
            <button className="month-nav next" onClick={nextMonth}>
              &gt;
            </button>
          </div>
          <button
            className={`today-btn px-3 py-1 rounded-md text-sm transition-colors ${
              isTodaySelected
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-blue-700 border border-blue-300 hover:bg-gray-50'
            }`}
            onClick={goToToday}
          >
            오늘
          </button>
        </div>
      </div>
    );
  };

  // 요일 헤더 렌더링
  const renderDays = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return (
      <div className="days-header">
        {days.map((day, i) => (
          <div
            className={`day-name 
              ${i === 0 ? 'text-red-500' : ''} 
              ${i === 6 ? 'text-blue-500' : ''}`}
            key={i}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  // 특정 날짜에 해당하는 일정 가져오기
  const getSchedulesForDate = (day) => {
    // console.log('Input day:', day);
    // console.log('All schedules:', schedules);

    const filteredSchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.expire_time);
      // console.log('Schedule expire_time:', scheduleDate);
      // console.log('Is same day:', isSameDay(day, scheduleDate));
      return isSameDay(day, scheduleDate);
    });

    // console.log('Filtered schedules:', filteredSchedules);
    return filteredSchedules;
  };

  // 날짜 클릭 핸들러 - 날짜 선택 및 일정 추가 모달 열기
  const handleDateClick = (day) => {
    setSelectedDate(day);

    // 이미 선택된 날짜를 다시 클릭할 때만 모달 열기
    if (isSameDay(day, selectedDate)) {
      openAddScheduleModal();
    }
  };

  // 모달 열기 - 일정 추가 폼
  const openAddScheduleModal = () => {
    setModalContent('form');
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  // 모달 열기 - 일정 수정 폼
  const openEditScheduleModal = (schedule) => {
    setModalContent('form');
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // 모달 열기 - 일정 상세 보기
  const openScheduleDetailModal = (schedule) => {
    setModalContent('detail');
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // 일정 저장 후 처리
  const handleScheduleSave = async (scheduleData) => {
    // console.log(scheduleData);
    try {
      if (selectedSchedule) {
        // 기존 일정 수정
        await updateSchedule(selectedSchedule.id, scheduleData);
      } else {
        // 새 일정 추가
        await addSchedule(scheduleData);
      }
      closeModal();
    } catch (err) {
      console.error('일정 저장 중 오류:', err);
    }
  };

  // 일정 삭제 후 처리
  const handleScheduleDelete = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId);
      closeModal();
    } catch (err) {
      console.error('일정 삭제 중 오류:', err);
    }
  };

  // 일정 색상 지정 함수
  const getColorByIndex = (index) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-red-100', 'bg-yellow-100'];
    return colors[index % colors.length];
  };

  // 셀 렌더링
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dailySchedules = getSchedulesForDate(cloneDay);

        // 날짜 상태 판단
        const isSelected = isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);

        days.push(
          <div
            className={`calendar-cell
              ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-300' : ''}
              ${isSelected ? 'selected-day' : ''} 
              ${isTodayDate && !isSelected ? 'current-day' : ''}`}
            key={day}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span
              className={`date-number 
              ${!isSameMonth(day, monthStart) ? 'text-gray-300' : ''} 
              ${isTodayDate ? 'text-blue-600 font-bold' : ''}
              `}
            >
              {formattedDate}
            </span>
            <div className="schedule-container">
              {dailySchedules.slice(0, 3).map((schedule, idx) => (
                <div
                  key={schedule.id}
                  className={`schedule-item ${getColorByIndex(idx)} text-xs rounded-md p-1`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openScheduleDetailModal(schedule);
                  }}
                >
                  {schedule.content}
                </div>
              ))}
              {dailySchedules.length > 3 && (
                <div
                  className="more-schedules text-xs text-gray-500 text-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(cloneDay);
                  }}
                >
                  + {dailySchedules.length - 3} 더보기
                </div>
              )}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  // 선택된 날짜의 일정 목록 렌더링
  // 선택된 날짜의 일정 목록 렌더링
  const renderScheduleList = () => {
    const selectedSchedules = getSchedulesForDate(selectedDate);
    const isTodaySelected = isToday(selectedDate);

    return (
      <div className="schedule-list">
        <div className="pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-bold">{format(selectedDate, 'yyyy년 M월 d일')} 일정</h3>
              {isTodaySelected && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">오늘</span>
              )}
            </div>
            <button
              className="add-btn text-white bg-blue-500 hover:bg-blue-600 rounded-full p-1.5 shadow-sm transition-colors"
              onClick={openAddScheduleModal}
              aria-label="일정 추가"
              title="일정 추가"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* 구분선 - 달력 헤더 구분선과 맞추기 */}
        <div className="border-b-2 border-blue-500 mb-4"></div>

        {/* 일정 목록 */}
        <div>
          {selectedSchedules.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {isTodaySelected ? '오늘 일정이 없습니다.' : '선택한 날짜의 일정이 없습니다.'}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedSchedules.map((schedule, idx) => (
                <div
                  key={schedule.id}
                  className={`schedule-list-item ${getColorByIndex(idx)} bg-opacity-50 rounded-lg p-4 transition relative`}
                >
                  {/* 내용 영역 - 버튼 영역과 분리 */}
                  <div className="cursor-pointer mb-2" onClick={() => openScheduleDetailModal(schedule)}>
                    <div className="text-sm font-medium text-gray-700">
                      {format(new Date(schedule.expire_time), 'HH:mm')}
                    </div>
                    <div className="text-base text-gray-900">{schedule.content}</div>
                  </div>

                  {/* 버튼 영역 - 오른쪽 아래에 배치 */}
                  <div className="flex space-x-2 absolute bottom-2 right-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 bg-white rounded-full p-1.5 shadow-sm hover:shadow transition"
                      onClick={(e) => {
                        e.stopPropagation(); // 상위 요소 클릭 이벤트 방지
                        openEditScheduleModal(schedule);
                      }}
                      aria-label="일정 수정"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 bg-white rounded-full p-1.5 shadow-sm hover:shadow transition"
                      onClick={(e) => {
                        e.stopPropagation(); // 상위 요소 클릭 이벤트 방지
                        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
                          handleScheduleDelete(schedule.id);
                        }
                      }}
                      aria-label="일정 삭제"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-page bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="grid md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2 p-6">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
          {/* 리스트 컬럼의 패딩 값을 조정 - 달력 컴포넌트와 동일하게 설정 */}
          <div className="md:col-span-1 bg-gray-50 p-6">
            {loading ? (
              <div className="text-center text-gray-500">로딩 중...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              renderScheduleList()
            )}
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent === 'form' && (
          <ScheduleForm
            date={selectedDate}
            existingSchedule={selectedSchedule}
            onSave={handleScheduleSave}
            onCancel={closeModal}
          />
        )}
        {modalContent === 'detail' && selectedSchedule && (
          <ScheduleDetail
            schedule={selectedSchedule}
            onEdit={openEditScheduleModal}
            onDelete={handleScheduleDelete}
            onClose={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;
