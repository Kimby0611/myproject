import { useLocation, useNavigate } from "react-router-dom";
import "../pageCSS/Notice.css";
import { useEffect, useState } from "react";
import { ReactComponent as Search } from "../images/Search.svg";

const FreeBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 15;

  const [searchOption, setSearchOption] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");

  //pagination, 게시판 데이터 불러오기 위한 선언문
  const NewWrite = () => {
    navigate("/BoardWritePage");
  };

  // 게시판 데이터 불러오기 & 검색어 query 불리언으로 있는 경우 검색어, 없으면 데이터호출

  const fetchPosts = (option = "title", query = "") => {
    let url = "http://localhost:8080/api/freeboard";
    if (query) {
      url = `http://localhost:8080/api/freeboard/search?option=${encodeURIComponent(
        option
      )}&query=${encodeURIComponent(query)}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Fetching Error", error));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("refresh") === "true") {
      fetchPosts();
      navigate("/freeboard", { replace: true });
    }
  }, [location.search, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const option = formData.get("searchOption");
    const query = formData.get("searchQuery").trim();

    setSearchOption(option);
    setSearchQuery(query);
    setCurrentPage(1);
    fetchPosts(option, query);
  };

  //Pagination 로직
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPost = post.slice(indexOfFirstPost, indexOfLastPost);
  const totalPage = Math.ceil(post.length / postPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const ViewPost = (postNum) => {
    navigate(`/fview/${postNum}`);
  };

  return (
    <div className="notiwrap">
      <div className="notitab">
        <a
          className={`noticea ${
            location.pathname === "/notice" ? "active" : ""
          }`}
          onClick={() => {
            setCurrentPage(1);
            navigate("/notice");
          }}
        >
          공지사항
        </a>
        <a
          className={`noticea ${
            location.pathname === "/freeboard" ? "active" : ""
          }`}
          onClick={() => {
            setCurrentPage(1);
            navigate("/freeboard");
          }}
        >
          자유게시판
        </a>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <label htmlFor="search" className="search">
              <select
                className="sel"
                name="searchOption"
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="writer">작성자</option>
                <option value="content">본문</option>
              </select>
              <div className="searchdiv">
                <input
                  type="text"
                  id="search"
                  name="searchQuery"
                  className="searchinput"
                  placeholder="검색어 입력"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" id="search" className="searchbtn">
                  <Search width={25} height={25} />
                </button>
              </div>
            </label>
          </form>
        </div>
      </div>

      <div>
        <table className="notice-th">
          <thead>
            <tr className="postlabel2">
              <th className="num">No</th>
              <th className="index">조회수</th>
              <th className="title">제목</th>
              <th className="writer">작성자</th>
              <th className="date">작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentPost.length > 0 ? (
              currentPost.map((post, index) => (
                <tr
                  key={post.num}
                  className="postlabel"
                  onClick={() => ViewPost(post.num)}
                >
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

      <div className="footwrap">
        <div className="pagination">
          {Array.from({ length: totalPage }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagebtn ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <div className="footer">
          <button type="button" onClick={NewWrite} className="writebtn">
            글쓰기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeBoard;
