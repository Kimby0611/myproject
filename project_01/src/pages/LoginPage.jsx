import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../component_css/login_regi_css/Login.css";
import Login from "../component/login_regi/Login";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowLogin(false);
    navigate("/");
  };
  const handleLoginSuccess = (userData) => {
    navigate("/"); // 로그인 성공 시 홈으로 이동
  };
  return (
    <div>
      {showLogin && (
        <Login onClose={handleClose} onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default LoginPage;
