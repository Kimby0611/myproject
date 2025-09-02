import { useState } from "react";
import "../../component_css/login_regi_css/RegisterForm.css";
import { validateInput, validateFormData } from "../../lib/validation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    userid: "",
    userpw: "",
    passwordConfirm: "",
    username: "",
    rrnfront: "",
    rrnback: "",
    email: "",
    phone: "",
  });
  const [errorMessages, setErrorMessage] = useState({});

  const errorId = () => {
    if (!errorMessages.userid) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.userid}
      </span>
    );
  };

  const errorPw = () => {
    if (!errorMessages.userpw) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.userpw}
      </span>
    );
  };

  const errorPwCon = () => {
    if (!errorMessages.passwordConfirm) return null;
    return (
      <span
        style={{
          color:
            errorMessages.passwordConfirm === "비밀번호가 일치합니다"
              ? "blue"
              : "red",
          marginLeft: "10px",
        }}
      >
        {errorMessages.passwordConfirm}
      </span>
    );
  };

  const errorName = () => {
    if (!errorMessages.username) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.username}
      </span>
    );
  };

  const errorRrnFront = () => {
    if (!errorMessages.rrnfront) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.rrnfront}
      </span>
    );
  };

  const errorRrnBack = () => {
    if (!errorMessages.rrnback) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.rrnback}
      </span>
    );
  };

  const errorEmail = () => {
    if (!errorMessages.email) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.email}
      </span>
    );
  };

  const errorPhone = () => {
    if (!errorMessages.phone) return null;
    return (
      <span style={{ color: "red", marginLeft: "10px" }}>
        {errorMessages.phone}
      </span>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 유효성 검사
    const newErrors = validateInput(name, value, formData);
    setErrorMessage(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateFormData(formData);
    setErrorMessage(newErrors);

    if (validateFormData(formData)) {
      try {
        const { passwordConfirm, ...dataToSubmit } = formData;
        const response = await axios.post(
          "http://localhost:8080/api/users/user_table",
          dataToSubmit,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // 회원가입 성공 시 alert 표시
        alert("회원가입이 완료되었습니다.");
        setSuccess("회원가입이 성공적으로 완료되었습니다.");

        // 가입 완료 후 홈페이지로 이동
        navigate("/");

        setFormData({
          userid: "",
          userpw: "",
          passwordConfirm: "",
          username: "",
          rrnfront: "",
          rrnback: "",
          email: "",
          phone: "",
        });
      } catch (error) {
        // 유효성 검사 실패 시 alert
        if (Object.values(newErrors).some((msg) => msg)) {
          alert("알맞은 형태로 회원가입 정보를 입력해주세요");
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (
      (e.target.name === "rrnFront" ||
        e.target.name === "rrnBack" ||
        e.target.name === "phone") &&
      !/[0-9]/.test(e.key) &&
      !allowedKeys.includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="regiWrap">
        <h2 className="regiTitle">회원가입</h2>
        <hr />
        <div className="regiInputs">
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="userid">ID</label>
                <span>{errorId()}</span>
              </div>
              <input
                type="text"
                id="userid"
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                placeholder="영어와 숫자만 (5~20자)"
                required
                maxLength="20"
              />
              <button
                type="button"
                style={{ color: "red" }}
                disabled
                title="DB 연동 필요"
              >
                중복 확인
              </button>
            </div>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="userpw">PW</label>
                <span>{errorPw()}</span>
              </div>
              <input
                type="password"
                id="userpw"
                name="userpw"
                value={formData.userpw}
                onChange={handleChange}
                placeholder="영어, 숫자, 특수문자 포함 (8~20자)"
                required
                maxLength="20"
              />
            </div>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="passwordConfirm">PW 확인</label>
                <span>{errorPwCon()}</span>
              </div>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 확인"
                required
                maxLength="20"
              />
            </div>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="username">이름</label>
                <span>{errorName()}</span>
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="한글로 작성 (2~10자)"
                required
                maxLength="10"
              />
            </div>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="rrnfront">주민등록번호</label>
                <span>{errorRrnFront()}</span>
              </div>
              <div className="rrnInput">
                <input
                  type="text"
                  id="rrnfront"
                  name="rrnfront"
                  value={formData.rrnfront}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="숫자 6자리"
                  // 이부분 maxLength로 사용하면 6글자 이하 전부 가능한거 아니에요?
                  maxLength="6"
                  required
                />

                <span>-</span>
                <input
                  type="password"
                  id="rrnback"
                  name="rrnback"
                  value={formData.rrnback}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="숫자 7자리"
                  maxLength="7"
                  required
                />
              </div>
            </div>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="email">
                  Email
                  <br />
                  (선택)
                </label>
                <span>{errorEmail()}</span>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@ex.com"
              />
            </div>
            <div className="inputGroup">
              <div className="confirmError">
                <label htmlFor="phone">
                  휴대폰 번호
                  <br />
                  (선택)
                </label>
                <span>{errorPhone()}</span>
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="숫자 11자리"
                maxLength="11"
              />
            </div>
            <div className="regiBtn">
              <button type="submit" className="submitBtn">
                회원가입
              </button>
              <button onClick={onClose} className="closeBtn">
                닫기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
