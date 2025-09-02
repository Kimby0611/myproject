import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduleEditForm = ({
  editingSchedule,
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

  // editingSchedule 변경 시 폼 데이터 초기화
  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        title: editingSchedule.title || "",
        content: editingSchedule.content || "",
        startTime: editingSchedule.startTime
          ? editingSchedule.startTime.slice(0, 5)
          : "", // HH:mm
        endTime: editingSchedule.endTime
          ? editingSchedule.endTime.slice(0, 5)
          : "", // HH:mm
      });
    }
  }, [editingSchedule]);

  // 수정 핸들러
  const handleUpdateSchedule = async () => {
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
      content: formData.content || null,
      date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
      startTime: formData.startTime,
      endTime: formData.endTime,
      completed: editingSchedule.completed || false,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/schedules/${editingSchedule.id}`,
        dataToSend
      );
      alert(response.data); // "일정이 수정되었습니다."
      setMode("list");
      fetchSchedules();
      window.location.reload();
    } catch (error) {
      console.error("일정 수정 실패:", error);
      alert(
        `❌ 일정 수정에 실패했습니다: ${error.response?.data || error.message}`
      );
    }
  };

  // 삭제 핸들러
  const handleDeleteSchedule = async () => {
    if (!window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/schedules/${editingSchedule.id}`
      );
      alert(response.data); // "일정이 삭제되었습니다."

      setMode("list");
      fetchSchedules();
      window.location.reload();
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      alert(
        `❌ 일정 삭제에 실패했습니다: ${error.response?.data || error.message}`
      );
    }
  };

  return (
    <div className="schedule-edit-form">
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
        <button onClick={handleUpdateSchedule}>수정</button>
        <button
          onClick={handleDeleteSchedule}
          style={{ backgroundColor: "#dc3545" }}
        >
          삭제
        </button>
        <button onClick={() => setMode("list")}>취소</button>
      </div>
    </div>
  );
};

export default ScheduleEditForm;
