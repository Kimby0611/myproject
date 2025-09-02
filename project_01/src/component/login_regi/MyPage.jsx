import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../lib/AuthContext";
import * as client from "../../lib/api";
import "../../component_css/login_regi_css/MyPage.css";

const MyPage = () => {
  const { userid } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    userid: "",
    username: "",
    rank: "",
    role: "",
    departmentname: "",
    phone: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userid) {
        setError("사용자 ID가 없습니다. 다시 로그인해 주세요.");
        return;
      }
      try {
        const response = await client.getUserById(userid);
        setUserInfo(response.data);
      } catch (err) {
        setError("사용자 정보를 불러오지 못했습니다.");
      }
    };
    fetchUserInfo();
  }, [userid]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCloseModal();
    }
  };

  return (
    <div className="mypage-wrapper">
      <h2>My Page</h2>
      {isModalOpen && (
        <div className="mypage-overlay" onKeyDown={handleKeyDown} tabIndex={0}>
          <div className="mypage-modal">
            <h3>사용자 정보</h3>
            {error ? (
              <p className="mypage-error">{error}</p>
            ) : (
              <div className="mypage-info">
                <p>
                  <strong>ID:</strong> {userInfo.userid || "없음"}
                </p>
                <p>
                  <strong>이름:</strong> {userInfo.username || "없음"}
                </p>
                <p>
                  <strong>직급:</strong> {userInfo.rank || "없음"}
                </p>
                <p>
                  <strong>역할:</strong> {userInfo.role || "없음"}
                </p>
                <p>
                  <strong>부서:</strong> {userInfo.departmentname || "없음"}
                </p>
                <p>
                  <strong>핸드폰 번호:</strong> {userInfo.phone || "없음"}
                </p>
                <p>
                  <strong>이메일:</strong> {userInfo.email || "없음"}
                </p>
              </div>
            )}
            <div className="mypage-actions">
              <button onClick={handleCloseModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
