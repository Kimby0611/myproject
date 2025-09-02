import { useNavigate, useParams } from "react-router-dom";
import "../pageCSS/PostPage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../lib/AuthContext";

const BoardPostPage = () => {
  const navigate = useNavigate();
  const { num } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/freeboard/${num}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error("게시글을 가져오지 못했습니다.");
        }
      } catch (error) {
        console.error("Fetching Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [num]);

  const BackButton = () => {
    navigate("/freeboard");
  };

  const EditButton = () => {
    navigate(`/BoardWritePage/${num}`, { state: { post } });
  };

  const DeleteButton = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/freeboard/${num}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          alert("게시글이 삭제되었습니다.");
          navigate("/freeboard", { state: { refresh: true } });
        } else {
          alert("게시글 삭제에 실패했습니다.");
          navigate(`/fview/${num}`, {state: {refresh: true}});
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("서버 오류가 발생했습니다.");
        navigate(`/fview/${num}`, {state: {refresh: true}});
      }
    }
  };

  if (loading) {
    return <div>로딩 중</div>;
  }
  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="postwrap">
      <div className="posthead">게시글</div>

      <div className="divline"></div>
      <div className="maindiv">
        <div className="titlediv">
          <div className="posttabwrap">
            <div className="title2div">
              <span className="posttitle2">제목: </span>
              <div className="inline">{post.title}</div>
            </div>
            <div className="con2div">
              <div className="posttab1">
                <span style={{ fontWeight: "bold" }}>작성자 : </span>
                <div className="inline">{post.writer}</div>
              </div>
              <div className="posttab1">
                <span style={{ fontWeight: "bold" }}>작성일 : </span>
                <div className="inline">{post.date}</div>
              </div>
              <div className="posttab1">
                <span style={{ fontWeight: "bold" }}>조회수 : </span>
                <div className="inline">{post.index}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="condiv">
          <div>{post.content}</div>
        </div>
      </div>
      <div className="postbtnwrap">
        {username === post.writer && (
          <>
            <button type="button" onClick={DeleteButton} className="deletebtn">
              삭제하기
            </button>
            <button type="button" onClick={EditButton} className="editbtn">
              수정하기
            </button>
          </>
        )}
        <button type="button" onClick={BackButton} className="backbtn2">
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default BoardPostPage;
