import React, { useEffect, useRef, useState } from "react";
import { deleteUser, updateUser, getDepartment, testuser } from "../../lib/api";
import "../../component_css/manage_css/EditUserModal.css";

const EditUserModal = ({ userInfo, onClose, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    userid: userInfo.userid || "",
    username: userInfo.username || "",
    rrnfront: userInfo.rrnfront || "",
    rrnback: userInfo.rrnback || "",
    departmentcode: userInfo.departmentcode || "",
    departmentname: userInfo.departmentname || "",
    rank: userInfo.rank || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
  });
  const [departments, setDepartments] = useState([]);
  const modalRef = useRef(null);
  const [user, setUser] = useState([]);
  const [rank, setRank] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptData = await getDepartment();
        const userData = await testuser();
        const users = userData.data;
        setUser(users);
        const uniqueRank = [
          ...new Set(users.map((u) => u.rank).filter(Boolean)),
        ];
        setRank(uniqueRank);
        console.log("rank : ", uniqueRank);
        setDepartments(deptData.data || []);
      } catch (error) {
        console.error("부서 데이터 가져오기 실패:", error);
        setDepartments([]);
      }
    };
    fetchDepartments();

    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [userInfo]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "department_name") {
      const selectedDept = departments.find(
        (dept) => dept.department_name === value
      );
      setFormData((prev) => ({
        ...prev,
        departmentname: value,
        departmentcode: selectedDept
          ? String(selectedDept.department_code)
          : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    if (!formData.email.includes("@")) {
      alert("유효한 이메일을 입력하세요.");
      return;
    }
    if (!/^\d{10,11}$/.test(formData.phone)) {
      alert("유효한 전화번호를 입력하세요 (10-11자리 숫자).");
      return;
    }
    console.log("Sending formData:", formData);
    try {
      const payload = {
        ...formData,
        departmentname: formData.departmentname,
      };
      await updateUser(userInfo.userid, payload);
      onUserUpdate();
      alert("사용자 정보가 성공적으로 수정되었습니다.");
      onClose();
    } catch (error) {
      console.error("수정 실패:", error);
      const errorMessage =
        error.response?.data || "사용자 정보 수정에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
      try {
        await deleteUser(userInfo.userid);
        onUserUpdate();
        alert("사용자가 성공적으로 삭제되었습니다.");
        onClose();
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("사용자 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      ref={modalRef}
      className="modal-overlay"
      tabIndex={-1}
    >
      <div className="modal-content">
        <h3 className="modal-title">사용자 정보 편집</h3>
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="user_name">이름 : </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              className="form-input"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="rrn_front">생년월일 : </label>
            <input
              type="text"
              name="rrn_front"
              value={formData.rrnfront}
              className="form-input"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="department_name">부서명 : </label>
            {departments.length > 0 ? (
              <select
                id="department_name"
                name="department_name"
                value={formData.departmentname || ""}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">부서 선택</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.department_name}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            ) : (
              <p>부서 데이터를 로드 중입니다...</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="rank">직급 : </label>
            <select
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">직급 선택</option>
              {rank.map((rank, index) => (
                <option key={index} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일 : </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">전화번호 : </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="modal-button delete" onClick={handleDelete}>
            삭제
          </button>
          <div className="button-group">
            <button className="modal-button cancel" onClick={handleUpdate}>
              수정
            </button>
            <button onClick={onClose} className="modal-button cancel">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
