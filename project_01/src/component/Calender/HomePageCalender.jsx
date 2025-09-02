import React, { useState, useEffect, useRef, useContext } from "react";
import "../../component_css/home_calender_css/HomePageCalender.css";
import { AuthContext } from "../../lib/AuthContext";
import axios from "axios";
import ScheduleList from "./ScheduleList.jsx";
import ScheduleAddComponent from "./ScheduleAddComponent.jsx";
import ScheduleEditForm from "./ScheduleEditForm.jsx";

const HomePageCalender = () => {
  const [schedules, setSchedules] = useState([]); // 일정 리스트
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState("list"); // 'list' | 'add' | 'edit'
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [manuallySelected, setManuallySelected] = useState(false);
  const { isLoggedIn, userid } = useContext(AuthContext);
  const [scheduleDates, setScheduleDates] = useState([]); // 일정 있는 날짜 목록

  // 요일 헤더
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 드롭다운 관련
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const yearDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearButtonRef = useRef(null);
  const monthButtonRef = useRef(null);

  // 드롭다운 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideYear =
        showYearDropdown &&
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(e.target) &&
        yearButtonRef.current &&
        !yearButtonRef.current.contains(e.target);

      const clickedOutsideMonth =
        showMonthDropdown &&
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(e.target) &&
        monthButtonRef.current &&
        !monthButtonRef.current.contains(e.target);

      if (clickedOutsideYear) setShowYearDropdown(false);
      if (clickedOutsideMonth) setShowMonthDropdown(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showYearDropdown, showMonthDropdown]);

  // 일정 날짜 목록 조회
  const fetchScheduleDates = async () => {
    if (!isLoggedIn || !userid) return;
    try {
      const response = await axios.get(
        "http://localhost:8080/api/schedules/dates",
        {
          params: { userId: userid },
        }
      );
      setScheduleDates(response.data); // ["2025-05-27", ...]
    } catch (error) {
      console.error("일정 날짜 조회 실패:", error);
    }
  };

  // 일정 조회
  const fetchSchedules = async () => {
    if (!isLoggedIn || !userid) return;
    const dateStr = selectedDate.toISOString().split("T")[0];
    try {
      const response = await axios.get(`http://localhost:8080/api/schedules`, {
        params: { date: dateStr, userId: userid },
      });
      setSchedules(response.data);
    } catch (error) {
      console.error("일정 불러오기 실패:", error);
      alert("일정을 불러오는 데 실패했습니다.");
    }
  };

  // 컴포넌트 마운트 및 userid 변경 시 날짜 목록 조회
  useEffect(() => {
    if (isLoggedIn && userid) {
      fetchScheduleDates();
    }
  }, [isLoggedIn, userid]);

  // 날짜 변경 시 일정 조회
  useEffect(() => {
    if (isLoggedIn && userid) {
      fetchSchedules();
    }
  }, [selectedDate, userid, isLoggedIn]);

  // 오늘 날짜로 복귀
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (
        !manuallySelected &&
        now.toDateString() !== selectedDate.toDateString()
      ) {
        setSelectedDate(now);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [selectedDate, manuallySelected]);

  const toggleYearDropdown = () => {
    setShowYearDropdown(!showYearDropdown);
    setShowMonthDropdown(false);
  };

  const toggleMonthDropdown = () => {
    setShowMonthDropdown(!showMonthDropdown);
    setShowYearDropdown(false);
  };

  const goToPreviousMonth = () => {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (day) => {
    if (day === "") return;
    setSelectedDay(day);
    setSelectedDate(new Date(year, month, day));
    setManuallySelected(true);
    setMode("list");
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [
    ...Array(firstDay).fill(""),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="calender-container">
      <div className="calender-part">
        {/* 상단 연/월 헤더 */}
        <div className="calender-header">
          <button className="nav-btn" onClick={goToPreviousMonth}>
            <img src="/images/cleft.png" alt="left" width={20} height={20} />
          </button>
          <span className="calender-title">
            <span
              ref={yearButtonRef}
              onClick={toggleYearDropdown}
              style={{ cursor: "pointer" }}
            >
              {year}년
            </span>{" "}
            <span
              ref={monthButtonRef}
              onClick={toggleMonthDropdown}
              style={{ cursor: "pointer" }}
            >
              {month + 1}월
            </span>
          </span>
          <button className="nav-btn" onClick={goToNextMonth}>
            <img src="/images/cright.png" alt="right" width={20} height={20} />
          </button>

          {(showYearDropdown || showMonthDropdown) && (
            <div className="drophead">
              {showYearDropdown && (
                <div className="dropdown year" ref={yearDropdownRef}>
                  {[...Array(11)].map((_, i) => {
                    const y = 2020 + i;
                    return (
                      <div
                        key={y}
                        className="dropdown-option"
                        onClick={() => {
                          setYear(y);
                          setShowYearDropdown(false);
                        }}
                      >
                        {y}년
                      </div>
                    );
                  })}
                </div>
              )}
              {showMonthDropdown && (
                <div className="dropdown month" ref={monthDropdownRef}>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="dropdown-option"
                      onClick={() => {
                        setMonth(i);
                        setShowMonthDropdown(false);
                      }}
                    >
                      {i + 1}월
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 요일 표시 */}
        <div className="calender-weekdays">
          {weekdays.map((day, i) => (
            <div key={i} className="weekday">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 표시 */}
        <div className="calender-days">
          {daysArray.map((day, index) => {
            const date = day ? new Date(year, month, day) : null;
            const dateStr = date ? date.toISOString().split("T")[0] : "";
            const hasSchedule = day && scheduleDates.includes(dateStr);
            const isTodayDay = day && isToday(day);
            const isSelected = day === selectedDay;

            return (
              <div
                key={index}
                className={`calender-day ${isSelected ? "active" : ""} ${
                  isTodayDay ? "todayColor" : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">
                  {day}
                  {hasSchedule && <span className="schedule-marker"></span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 일정 UI */}
      <div className="schedule-ui-container">
        {isLoggedIn ? (
          <div className="schedule-ui-inner">
            <h3>
              {isToday(selectedDate)
                ? `오늘 일정 (${selectedDate.getFullYear()}년 ${
                    selectedDate.getMonth() + 1
                  }월 ${selectedDate.getDate()}일)`
                : `${selectedDate.getFullYear()}년 ${
                    selectedDate.getMonth() + 1
                  }월 ${selectedDate.getDate()}일 일정`}
            </h3>
            {mode === "list" && (
              <ScheduleList
                schedules={schedules}
                setMode={setMode}
                setEditingSchedule={setEditingSchedule}
              />
            )}
            {mode === "add" && (
              <ScheduleAddComponent
                selectedDate={selectedDate}
                userid={userid}
                setMode={setMode}
                fetchSchedules={fetchSchedules}
              />
            )}
            {mode === "edit" && (
              <ScheduleEditForm
                editingSchedule={editingSchedule}
                selectedDate={selectedDate}
                userid={userid}
                setMode={setMode}
                setEditingSchedule={setEditingSchedule}
                fetchSchedules={fetchSchedules}
              />
            )}
          </div>
        ) : (
          <div className="schedule-ui-inner">
            <p style={{ color: "red", fontWeight: "bold" }}>
              로그인이 필요한 기능입니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePageCalender;
