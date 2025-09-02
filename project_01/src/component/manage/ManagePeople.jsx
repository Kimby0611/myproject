import React, { useContext, useEffect, useState } from "react";
import * as client from "../../lib/api";
import "../../component_css/manage_css/Manage.css";
import EditUserModal from "./EditUserModal";
import { AuthContext } from "../../lib/AuthContext";

const ManagePeople = () => {
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [ranks, setRanks] = useState([]);
  const { rank } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await client.testuser();
      const users = response.data;
      setUser(users);
      setDisplayedUsers(users);
      const uniqueDepartments = [
        ...new Set(users.map((u) => u.departmentname).filter(Boolean)),
      ];
      const uniqueRank = [...new Set(users.map((u) => u.rank).filter(Boolean))];
      setRanks(uniqueRank);
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("사용자 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    let filtered = [...user];

    // 이름 검색 (dept === "name")
    if (dept === "name" && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((info) =>
        info.username?.toLowerCase().includes(searchLower)
      );
    }

    // 부서명 검색 (dept === "part")
    if (dept === "part" && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (info) => info.departmentname?.toLowerCase() === searchLower
      );
    }

    // 직급 검색 (rankFilter 사용)
    if (rankFilter) {
      const rankLower = rankFilter.toLowerCase();
      filtered = filtered.filter(
        (info) => info.rank?.toLowerCase() === rankLower
      );
    }

    setDisplayedUsers(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openModal = (userInfo) => {
    setSelectUser(userInfo);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setSelectUser(null);
  };

  const editableRanks = ["사장", "이사"];

  return (
    <div className="mpWrap">
      <div className="mpSearch">
        <p>총 사원 수 : {user.length}</p>
        <div className="searchdiv">
          <select
            value={dept}
            onChange={(e) => {
              setDept(e.target.value);
              setSearch("");
            }}
            className="selectBox"
          >
            <option value="">전체</option>
            <option value="part">부서명</option>
            <option value="name">이름</option>
            <option value="rank">직급</option>
          </select>
          <div className="searchBox">
            {dept === "part" ? (
              <select
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="selectBox"
              >
                <option value="">부서 선택</option>
                {departments.map((deptName, index) => (
                  <option key={index} value={deptName}>
                    {deptName}
                  </option>
                ))}
              </select>
            ) : dept === "rank" ? (
              <select
                value={rankFilter} // rankFilter 사용
                onChange={(e) => setRankFilter(e.target.value)}
                className="selectBox"
              >
                <option value="">직급 선택</option>
                {rank.map((rank, index) => (
                  <option key={index} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}
            <button onClick={handleSearch} className="searchButton">
              검색
            </button>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="userTable">
          <thead className="userThead">
            <tr className="headTr">
              <th>NO.</th>
              <th>이름</th>
              <th>생년</th>
              <th>부서</th>
              <th>직급</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="manageTbody">
            {displayedUsers.length === 0 && (search || rankFilter) ? (
              <tr>
                <td colSpan="8">검색 결과가 없습니다.</td>
              </tr>
            ) : (
              displayedUsers.map((info, index) => (
                <tr
                  key={info.userid}
                  style={{ cursor: "pointer" }}
                  className="userTr"
                >
                  <td>{index + 1}</td>
                  <td>{info.username}</td>
                  <td>{info.rrnfront}</td>
                  <td>{info.departmentname || "-"}</td>
                  <td>{info.rank || "-"}</td>
                  <td>{info.phone || "-"}</td>
                  <td>{info.email || "-"}</td>
                  <td>
                    {editableRanks.includes(rank) && (
                      <button
                        onClick={() => openModal(info)}
                        className="updateButton"
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isOpenModal && (
        <EditUserModal
          userInfo={selectUser}
          onClose={closeModal}
          onUserUpdate={fetchUsers}
        />
      )}
    </div>
  );
};

export default ManagePeople;
