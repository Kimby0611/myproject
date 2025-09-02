import React from "react";
import "../../component_css/home_component_css/HomePageNotice.css";

const HomePageNotice = () => {
  return (
    <div className="homepage-notice-container">
      <h2 className="notice-title">자유게시판</h2>
      <div className="notice-list">
        <p className="notice-placeholder">
          여기에 자유게시판 내용 들어갈 예정입니다.
        </p>
      </div>
    </div>
  );
};

export default HomePageNotice;
