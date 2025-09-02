// Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../lib/AuthContext";
import { loginCheck } from "../../lib/api";
import "../../component_css/login_regi_css/Login.css";
import closeimage from "../../images/close.png";
import { useNavigate } from "react-router-dom";

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const [userid, setUserid] = useState("");
  const [userpw, setUserpw] = useState("");
  const [error, setError] = useState("");
  const { login, logout } = useContext(AuthContext); // logout 추가
  const navigate = useNavigate();

  const goRegister = () => {
    navigate("/register");
    onClose();
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose(); // 팝업 닫기
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginCheck(userid, userpw);
      const userData = response.data;
      login(userData); // AuthContext의 login 호출
      onLoginSuccess(userData); // 성공 핸들러 호출
      //로그인 성공 시 Error 메세지 초기화
      setError("");
      //로그인 성공 후 로그아웃 했을 때 id, pw 칸 초기화
      setUserid("");
      setUserpw("");
      onClose(); // 팝업 닫기
    } catch (err) {
      //로그인 실패 시 error 메세지 셋, 아이디는 초기화하지 않고 pw만 초기화함
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
      setUserpw("");
      logout(); // 로그인 실패 시 로그아웃 처리
    }
  };

  //팝업이 안열리면 아무것도 로딩 안함.
  if (!isOpen) return null;

  return (
    <div className="popup_background">
      <div className="popup_container">
        <div className="popup_head">
          <div className="popup_logo">Login</div>
          <button type="button" onClick={onClose} className="closebtn_login">
            <img src={closeimage} alt="closeimg" className="closeimg" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="login_form">
          <div className="idinput">
            <label>아이디</label>
            <input
              type="text"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              required
            />
          </div>
          <div className="pwinput">
            <label>비밀번호</label>
            <input
              type="password"
              value={userpw}
              onChange={(e) => setUserpw(e.target.value)}
              required
            />
          </div>
          <div className="popup_btn">
            <div className="error_message">
              {error && (
                <p style={{ color: "red", fontSize: "15px" }}>{error}</p>
              )}
            </div>
            <div className="login_regi_btn">
              <button type="submit" className="login_btn">
                로그인
              </button>
              <button className="regi_btn" onClick={goRegister}>
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
