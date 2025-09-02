import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../lib/AuthContext";
import * as client from "../../lib/api";
import "../../component_css/login_regi_css/CheckPassword.css";
import "../../component_css/login_regi_css/MyPage.css";

const CheckPassword = ({ onClose = () => {}, onVerified = () => {} }) => {
  const { isLoggedIn, userid } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userid: "",
    username: "",
    rank: "",
    role: "",
    departmentname: "",
    phone: "",
    email: "",
  });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (showUserInfo) {
        setShowUserInfo(false);
        setError("");
      } else {
        handleCancel();
      }
    } else if (e.key === "Enter" && !showUserInfo && !isLoading) {
      e.preventDefault();
      handleConfirm();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = async () => {
    if (!isLoggedIn || !userid) {
      setError("로그인이 필요합니다. 다시 로그인해 주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await client.verifyPassword(userid, password);
      if (response.status === 200) {
        const userResponse = await client.getUserById(userid);
        const userData = userResponse.data || {};
        setUserInfo(userData);
        setShowUserInfo(true);
        setPassword("");
        setError("");
        onVerified(userData); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "비밀번호가 틀렸습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="check-modal-overlay" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className={showUserInfo ? "mypage-modal" : "check-modal-content"} ref={modalRef}>
        {showUserInfo ? (
          <>
            <h3>사용자 정보</h3>
            {error ? (
              <p className="mypage-error">{error}</p>
            ) : (
              <div className="mypage-info">
                <p><strong>ID:</strong> {userInfo.userid || "없음"}</p>
                <p><strong>이름:</strong> {userInfo.username || "없음"}</p>
                <p><strong>직급:</strong> {userInfo.rank || "없음"}</p>
                <p><strong>역할:</strong> {userInfo.role || "없음"}</p>
                <p><strong>부서:</strong> {userInfo.departmentname || "없음"}</p>
                <p><strong>핸드폰 번호:</strong> {userInfo.phone || "없음"}</p>
                <p><strong>이메일:</strong> {userInfo.email || "없음"}</p>
              </div>
            )}
            <div className="mypage-actions">
              <button onClick={handleCancel} disabled={isLoading}>
                닫기
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="check-title">비밀번호 확인</h2>
            <input
              type="password"
              className="check-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="비밀번호를 입력하세요"
              autoFocus
              disabled={isLoading}
            />
            {error && <p className="check-error">{error}</p>}
            {isLoading && <p className="check-loading">처리 중...</p>}
            <div className="check-modal-buttons">
              <button
                className="check-confirm-button"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "확인 중..." : "확인"}
              </button>
              <button
                className="check-cancel-button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckPassword;