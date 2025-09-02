import React, { useEffect, useState } from "react";
import "../../component_css/home_component_css/HomePageNotice.css";
import { useNavigate } from "react-router-dom";

const HomePageNotice = () => {
  const [post, setPost] = useState([]);
  const [currentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("notice");
  const postPerPage = 5;
  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPost = post.slice(indexOfFirstPost, indexOfLastPost);

  const fetchPosts = (tab) => {
    const url =
      tab === "notice"
        ? "http://localhost:8080/api/notice"
        : "http://localhost:8080/api/freeboard";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const sortData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPost(sortData);
      })
      .catch((error) => console.error("Fetching Error", error));
  };

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  const ViewPost = (postNum) => {
    const route = activeTab === "notice" ? `/notice` : `/freeboard`;
    navigate(route);
  };
  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="homepage-notice-container">
      <div className="home-notice-title">
        <button
          className={`home-tab-button ${
            activeTab === "notice" ? "active" : ""
          }`}
          onClick={() => handleChangeTab("notice")}
        >
          공지사항
        </button>
        <button
          className={`home-tab-button ${
            activeTab === "freeboard" ? "active" : ""
          }`}
          onClick={() => handleChangeTab("freeboard")}
        >
          자유게시판
        </button>
      </div>

      <div className="home-notice-list">
        <div className="home-placeholder">
          <table className="home-table">
            <thead>
              <tr className="homenoticeth">
                <th>No</th>
                <th>조회수</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody onClick={() => ViewPost(post.num)}>
              {currentPost.length > 0 ? (
                currentPost.map((post, index) => (
                  <tr key={post.num} className="homeLabel">
                    <td>{(currentPage - 1) * postPerPage + (index + 1)}</td>
                    <td>{post.index}</td>
                    <td>{post.title}</td>
                    <td>{post.writer}</td>
                    <td>{post.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">게시물이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePageNotice;
