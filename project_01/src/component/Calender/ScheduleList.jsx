import React from "react";
import "../../component_css/home_calender_css/ScheduleList.css";

const ScheduleList = ({ schedules, setMode, setEditingSchedule }) => {
  // 시간 포맷팅 함수 (HH:mm:ss -> HH:mm)
  const formatTime = (time) => {
    return time && time.length >= 5 ? time.slice(0, 5) : time;
  };

  return (
    <div className="schedule-list-container">
      <ul className="schedule-list">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <li
              key={schedule.id}
              className="schedule-item"
              onClick={() => {
                setEditingSchedule(schedule);
                setMode("edit");
              }}
            >
              <div className="schedule-details">
                <h4 className="schedule-title">
                  {schedule.title}{" "}
                  <span className="schedule-time">
                    ( {formatTime(schedule.startTime)} -{" "}
                    {formatTime(schedule.endTime)} )
                  </span>
                </h4>

                {schedule.content && (
                  <span className="schedule-content-preview">
                    {schedule.content.length > 20
                      ? `${schedule.content.substring(0, 20)}...`
                      : schedule.content}
                  </span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li
            className="schedule-item empty"
            onClick={() => {
              setEditingSchedule({
                id: "",
                userId: "",
                title: "",
                content: "",
                date: "",
                startTime: "",
                endTime: "",
                completed: false,
              });
              setMode("add"); // 빈 상태 클릭 시 추가 모드
            }}
          >
            <p className="empty-message">
              오늘의 일정이 없습니다. 클릭하여 새 일정을 추가하세요!
            </p>
          </li>
        )}
      </ul>
      <div className="schedule-btn">
        <button onClick={() => setMode("add")}>일정 추가</button>
      </div>
    </div>
  );
};

export default ScheduleList;
