import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduleAddComponent = ({
  selectedDate,
  userid,
  setMode,
  fetchSchedules,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    startTime: "",
    endTime: "",
  });
  const navigate = useNavigate();

  const handleAddSchedule = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      alert("일정 제목을 입력해주세요.");
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      alert("시작 시간과 종료 시간을 입력해주세요.");
      return;
    }

    const dataToSend = {
      userId: userid,
      title: formData.title,
      content: formData.content || null, // 내용은 선택 사항
      date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
      startTime: formData.startTime, // HH:mm
      endTime: formData.endTime, // HH:mm
      completed: false,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/schedules",
        dataToSend
      );
      alert(response.data); // "일정이 등록되었습니다."

      setFormData({
        title: "",
        content: "",
        startTime: "",
        endTime: "",
      });
      setMode("list");
      fetchSchedules();
      window.location.reload();
    } catch (error) {
      console.error("일정 등록 실패:", error);
      alert(
        `❌ 일정 등록에 실패했습니다: ${error.response?.data || error.message}`
      );
    }
  };

  return (
    <div>
      <div className="todotitle">
        <label>일정 제목:</label>
        <input
          className="textarea titleinput"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="time-sec">
        <div className="time-div">
          <label>시작 시간:</label>
          <input
            type="time"
            className="time-input textarea"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
        </div>
        <div className="time-div">
          <label>종료 시간:</label>
          <input
            type="time"
            className="time-input textarea"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        <label className="textareatitle">내용:</label>
        <textarea
          className="textarea"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        ></textarea>
      </div>
      <div className="schedule-btn" style={{ marginTop: "10px" }}>
        <button onClick={handleAddSchedule}>추가</button>
        <button onClick={() => setMode("list")}>취소</button>
      </div>
    </div>
  );
};

export default ScheduleAddComponent;
