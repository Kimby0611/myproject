import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../pageCSS/WritePage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../lib/AuthContext";

const BoardWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { num } = useParams();
  const { state } = useLocation();
  const {username} = useContext(AuthContext);

  useEffect(() => {
    console.log("state:", state);
    if (state?.post) {
      setTitle(state.post.title || "");
      setContent(state.post.content || "");
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noticeData = {
      num: num ? parseInt(num) : 0,
      title: title,
      content: content,
      writer : username,
      date: state?.post?.date || new Date().toISOString().split("T")[0],
      index: state?.post?.index || 0,
    };

    try {
      const url = num
        ? `http://localhost:8080/api/freeboard/${parseInt(num)}`
        : "http://localhost:8080/api/freeboard";
      const method = num ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });

      if (response.ok) {
        const responseData = await response.json()
        const newNum = num || responseData.num;
        alert(num ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
        navigate(`/fview/${newNum}`, { state: { refresh: true } });
      } else {
        alert(
          num ? "게시글 수정에 실패했습니다." : "게시글 작성에 실패했습니다."
        );
      }
    } catch (error) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="writewrap">
      <div className="writeheader">{num ? "글 수정" : "글쓰기"}</div>
      <form className="contentform">
        <div>
          <span className="posttitle">제목 : </span>
          <input
            type="text"
            className="writetitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <span className="contitle">내용 : </span>
          <textarea
            type="text"
            className="writecon"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="wbtnwrap">
          <button type="submit" onClick={handleSubmit} className="writebtn2">
            {num ? "수정" : "작성"}
          </button>
          <button type="button" onClick={handleBack} className="backbtn">
            뒤로가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardWritePage;
