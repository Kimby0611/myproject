import React, { useState } from "react";
import RegisterForm from "../component/RegisterForm";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [showRegi, setShowRegi] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowRegi(false);
    navigate("/login");
  };
  return (
    <div>{showRegi && <RegisterForm onClose={handleClose}></RegisterForm>}</div>
  );
};

export default RegisterPage;
