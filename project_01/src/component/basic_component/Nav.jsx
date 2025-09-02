import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../lib/AuthContext";
import "../../component_css/basic_component_css/Nav.css";
import Login from "../login_regi/Login";
import CheckPassword from "../login_regi/CheckPassword";
import * as client from "../../lib/api";

const Nav = () => {
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const {
    isLoggedIn,
    userid,
    username,
    logout,
    isLoginModalOpen,
    setIsLoginModalOpen,
    role,
    rank,
  } = useContext(AuthContext);

  const checkLogin = (path) => {
    if (
      !isLoggedIn &&
      ["/mail", "/elec", "/assets", "/notice", "/manage"].includes(path)
    ) {
      setIsLoginModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleMailClick = () => checkLogin("/mail");
  const handleHomeClick = () => checkLogin("/");
  const handleAssetClick = () => checkLogin("/assets");
  const handleElecClick = () => checkLogin("/elec");
  const handleNoticeClick = () => checkLogin("/notice");
  const handleManageClick = () => checkLogin("/manage");
  const goLogin = () => setIsLoginModalOpen(true);
  const goCheck = () => navigate("/checkpassword");

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false); // 로그인 성공 시 팝업 닫기
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openModal = async () => {
    setIsOpenModal(true);
    console.log("Sending userid:", userid); // userid 확인
    try {
      const response = await client.getUserPassword(userid);
      console.log("yourpassword:", response.data);
    } catch (error) {
      console.error("비밀번호 조회 실패:", error);
    }
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    // 여기.
    <div className="navWrap">
      <div>
        <p className="logo" onClick={handleHomeClick}>
          ERP System
        </p>
      </div>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="user-info">
            <p className="user-role">{role}</p>
            <div className="userNameDiv">
              <p className="navUsername">
                <span className="myname" onClick={openModal}>
                  {username}
                </span>
                <span className="myRank"> {rank}님</span>
              </p>
            </div>
            <div className="logoutDiv">
              <button onClick={handleLogout} className="logout">
                로그아웃
                <img src="/images/logout.png" alt="" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={goLogin} className="NavloginButton">
            ERP Login
          </button>
        )}
      </div>

      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <div className="navItem" onClick={handleMailClick}>
        <svg
          className="navIcon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="6" width="16" height="12" rx="2" strokeWidth="2" />
          <path d="M4 8 L12 12 L20 8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>메일</span>
      </div>

      <div className="navItem" onClick={handleElecClick}>
        <svg
          className="navIcon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <span>전자결재</span>
      </div>

      <div className="navItem" onClick={handleAssetClick}>
        <svg
          className="navIcon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>자산관리</span>
      </div>

      <div className="navItem" onClick={handleNoticeClick}>
        <svg
          className="navIcon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
        <span>게시판</span>
      </div>

      <div className="navItem" onClick={handleManageClick}>
        <svg
          className="navIcon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span>직원관리</span>
      </div>
      {isOpenModal && <CheckPassword onClose={closeModal} />}
    </div>
  );
};

export default Nav;
