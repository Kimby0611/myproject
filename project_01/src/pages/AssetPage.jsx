import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AssetModal from "../component/asset/AssetModal"; // AssetModal 임포트
import "../component_css/asset_css/Asset.css";
import useDebouncedState from "../lib/useDebouncedState";
import * as client from "../lib/api";
import { AuthContext } from "../lib/AuthContext";

const AssetPage = () => {
  const { rank } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [originalFilteredAssets, setOriginalFilteredAssets] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [assetNumber, debouncedAssetNumber, setAssetNumber] = useDebouncedState(
    "",
    300
  );
  const [detailedFilters, setDetailedFilters] = useState({
    status: "사용",
    charge_department: "",
    asset_name: "",
    start_year: "",
    start_month: "",
    start_day: "",
    end_year: "",
    end_month: "",
    end_day: "",
  });
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("none");
  const [openModal, setOpenModal] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [isDisposeMode, setIsDisposeMode] = useState(false);
  const [disposeAssets, setDisposeAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedDisposeAssets, setSelectedDisposeAssets] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: currentYear - 1990 + 1 }, (_, i) =>
        (1990 + i).toString()
      ),
    [currentYear]
  );
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")),
    []
  );
  const days = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0")),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, departmentsResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/assets"),
          axios.get("http://localhost:8080/api/department-names"),
        ]);
        setAssets(assetsResponse.data);
        setDepartmentList(departmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchAssets = useCallback(async () => {
    try {
      const response = await client.assetData();
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  }, []);

  const handleFilterChange = useCallback(
    (field) => (event) => {
      setDetailedFilters((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleQuery = useCallback(() => {
    const filtered = assets.filter((asset) => {
      const {
        status,
        charge_department,
        asset_name,
        start_year,
        start_month,
        start_day,
        end_year,
        end_month,
        end_day,
      } = detailedFilters;

      if (status !== "전체" && asset.status !== status) return false;
      if (charge_department && asset.charge_department !== charge_department)
        return false;
      if (
        asset_name &&
        !asset.asset_name.toLowerCase().includes(asset_name.toLowerCase())
      )
        return false;
      if (
        debouncedAssetNumber &&
        !asset.asset_number
          .toLowerCase()
          .startsWith(debouncedAssetNumber.toLowerCase())
      )
        return false;

      let startDate = null;
      let endDate = null;
      if (start_year && start_month && start_day) {
        startDate = new Date(`${start_year}-${start_month}-${start_day}`);
      }
      if (end_year && end_month && end_day) {
        endDate = new Date(`${end_year}-${end_month}-${end_day}`);
      }

      const assetDate = new Date(asset.create_year);
      if (startDate && assetDate < startDate) return false;
      if (endDate && assetDate > endDate) return false;

      return true;
    });

    setFilteredAssets(filtered);
    setOriginalFilteredAssets(filtered);
    setShowTable(true);
    setSortField(null);
    setSortOrder("none");
  }, [assets, detailedFilters, debouncedAssetNumber]);

  const sortAssets = useCallback(
    (field) => {
      let newSortOrder = "asc";
      if (sortField === field) {
        if (sortOrder === "asc") newSortOrder = "desc";
        else if (sortOrder === "desc") newSortOrder = "none";
        else newSortOrder = "asc";
      }
      setSortField(field);
      setSortOrder(newSortOrder);

      if (newSortOrder === "none") {
        setFilteredAssets([...originalFilteredAssets]);
        setDisposeAssets([...disposeAssets]);
      } else {
        const sortedFiltered = [...filteredAssets].sort((a, b) => {
          let valueA, valueB;
          switch (field) {
            case "asset_number":
            case "asset_name":
            case "charge_department":
            case "status":
            case "create_company":
              valueA = a[field] || "";
              valueB = b[field] || "";
              return newSortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            case "asset_price":
              valueA = parseFloat(a[field]) || 0;
              valueB = parseFloat(b[field]) || 0;
              return newSortOrder === "asc" ? valueA - valueB : valueB - valueA;
            case "create_year":
              valueA = new Date(a[field]);
              valueB = new Date(b[field]);
              return newSortOrder === "asc" ? valueA - valueB : valueB - valueA;
            default:
              return 0;
          }
        });
        setFilteredAssets(sortedFiltered);
      }
    },
    [
      sortField,
      sortOrder,
      filteredAssets,
      originalFilteredAssets,
      disposeAssets,
    ]
  );

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleDisposeModeToggle = useCallback(() => {
    if (isDisposeMode) {
      setDisposeAssets([]);
      setSelectedAssets([]);
      setSelectedDisposeAssets([]);
      setIsDisposeMode(false);
    } else {
      setIsDisposeMode(true);
    }
  }, [isDisposeMode]);

  const handleAssetSelect = useCallback((assetNumber) => {
    setSelectedAssets((prev) =>
      prev.includes(assetNumber)
        ? prev.filter((num) => num !== assetNumber)
        : [...prev, assetNumber]
    );
  }, []);

  const handleDisposeAssetSelect = useCallback((assetNumber) => {
    setSelectedDisposeAssets((prev) =>
      prev.includes(assetNumber)
        ? prev.filter((num) => num !== assetNumber)
        : [...prev, assetNumber]
    );
  }, []);

  const handleSelectAllAssets = useCallback(() => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((asset) => asset.asset_number));
    }
  }, [selectedAssets, filteredAssets]);

  const handleSelectAllDisposeAssets = useCallback(() => {
    if (selectedDisposeAssets.length === disposeAssets.length) {
      setSelectedDisposeAssets([]);
    } else {
      setSelectedDisposeAssets(
        disposeAssets.map((asset) => asset.asset_number)
      );
    }
  }, [selectedDisposeAssets, disposeAssets]);

  const handleMoveUp = useCallback(() => {
    const assetsToMove = filteredAssets.filter((asset) =>
      selectedAssets.includes(asset.asset_number)
    );
    setDisposeAssets((prev) => [...prev, ...assetsToMove]);
    setFilteredAssets((prev) =>
      prev.filter((asset) => !selectedAssets.includes(asset.asset_number))
    );
    setSelectedAssets([]);
  }, [filteredAssets, selectedAssets]);

  const handleMoveDown = useCallback(() => {
    const assetsToMove = disposeAssets.filter((asset) =>
      selectedDisposeAssets.includes(asset.asset_number)
    );
    setFilteredAssets((prev) => [...prev, ...assetsToMove]);
    setDisposeAssets((prev) =>
      prev.filter(
        (asset) => !selectedDisposeAssets.includes(asset.asset_number)
      )
    );
    setSelectedDisposeAssets([]);
  }, [disposeAssets, selectedDisposeAssets]);

  const handleDisposeAssets = useCallback(async () => {
    if (disposeAssets.length === 0) {
      alert("폐기 신청할 자산이 없습니다.");
      return;
    }

    try {
      const assetNumbers = disposeAssets.map((asset) => asset.asset_number);
      await axios.post(
        "http://localhost:8080/api/assets/dispose",
        assetNumbers
      );
      alert("폐기 신청이 완료되었습니다");
      setDisposeAssets([]);
      setSelectedDisposeAssets([]);
      await fetchAssets();
      handleQuery();
    } catch (error) {
      console.error("Error disposing assets:", error);
    }
  }, [disposeAssets, fetchAssets, handleQuery]);

  const editableRanks = ["사장", "이사", "부장", "차장"];

  return (
    <div className="container">
      <div className="searchSection">
        <span className="sectionTitle">자산 검색</span>

        <span className="subTitle">폐기 유무</span>
        <RadioGroup
          row
          value={detailedFilters.status}
          onChange={handleFilterChange("status")}
          className="radioGroup"
        >
          <FormControlLabel
            value="사용"
            control={<Radio color="secondary" size="small" />}
            label="사용"
            className="radioLabel"
          />
          <FormControlLabel
            value="폐기"
            control={<Radio color="secondary" size="small" />}
            label="폐기"
            className="radioLabel"
          />
          <FormControlLabel
            value="전체"
            control={<Radio color="secondary" size="small" />}
            label="전체"
            className="radioLabel"
          />
        </RadioGroup>

        <span className="subTitle">상세 검색(선택)</span>

        <span className="subTitle">부서명</span>
        <select
          value={detailedFilters.charge_department}
          onChange={handleFilterChange("charge_department")}
          className="left_select"
        >
          <option value="">부서를 선택하세요</option>
          {departmentList.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <span className="subTitle">물품명</span>
        <input
          type="text"
          value={detailedFilters.asset_name}
          onChange={handleFilterChange("asset_name")}
          placeholder=" ex) 모니터"
          className="left_input"
        />

        <span className="subTitle">자산번호</span>
        <input
          type="text"
          value={assetNumber}
          onChange={(e) => setAssetNumber(e.target.value)}
          placeholder="ex) A0001"
          className="left_input"
        />

        <span className="subTitle">제조년도 필터</span>
        <div className="filter_div">
          <select
            value={detailedFilters.start_year}
            onChange={handleFilterChange("start_year")}
            className="year_sel"
          >
            <option value="">년</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={detailedFilters.start_month}
            onChange={handleFilterChange("start_month")}
            className="mon_day_sel"
          >
            <option value="">월</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={detailedFilters.start_day}
            onChange={handleFilterChange("start_day")}
            className="mon_day_sel"
          >
            <option value="">일</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span className="dateLabel">부터</span>
        </div>
        <div className="filter_div">
          <select
            value={detailedFilters.end_year}
            onChange={handleFilterChange("end_year")}
            className="year_sel" // 오타 수정
          >
            <option value="">년</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={detailedFilters.end_month}
            onChange={handleFilterChange("end_month")}
            className="mon_day_sel"
          >
            <option value="">월</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={detailedFilters.end_day}
            onChange={handleFilterChange("end_day")}
            className="mon_day_sel"
          >
            <option value="">일</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span className="dateLabel">까지</span>
        </div>

        <button className="queryButton" onClick={handleQuery}>
          조회
        </button>
      </div>

      <div className="dataSection">
        <div className="headerContainer">
          <div className="assetTitle">
            <span className="sectionTitle">데이터 조회</span>
          </div>
          {editableRanks.includes(rank) && (
            <div className="actionButtonContainer">
              <button className="addButton" onClick={handleOpenModal}>
                <span className="plusIcon">+</span> 자산 등록
              </button>
              <button
                className="disposeButton"
                onClick={handleDisposeModeToggle}
              >
                {isDisposeMode ? "폐기 취소" : "폐기 신청"}
              </button>
            </div>
          )}
        </div>

        {isDisposeMode ? (
          <div className="disposeSection">
            <div className="disposeUpperSection">
              <div className="sectionHeader">
                <span className="section_header_span">폐기 신청할 자산</span>
                <div className="section_header_btn">
                  <button
                    className="selectAllButton"
                    onClick={handleSelectAllDisposeAssets}
                  >
                    {selectedDisposeAssets.length === disposeAssets.length
                      ? "전체 해제"
                      : "전체 선택"}
                  </button>
                  <button className="moveButton" onClick={handleMoveDown}>
                    <ArrowDownwardIcon
                      style={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    아래로 이동
                  </button>
                  <button
                    className="disposeConfirmButton"
                    onClick={handleDisposeAssets}
                  >
                    폐기 신청
                  </button>
                </div>
              </div>
              <div
                className={`tableContainer ${
                  showTable && filteredAssets.length > 0
                    ? "table-container-auto"
                    : "table-container-hidden"
                }`}
              >
                <table className="table">
                  <thead>
                    <tr className="table-row">
                      <th className="table-header table-cell-select">선택</th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("asset_number")}
                      >
                        자산번호
                        {sortField === "asset_number" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("asset_name")}
                      >
                        물품명
                        {sortField === "asset_name" && sortOrder !== "none" && (
                          <span className="sortIcon">
                            {sortOrder === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("asset_price")}
                      >
                        가격
                        {sortField === "asset_price" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("charge_department")}
                      >
                        담당부서
                        {sortField === "charge_department" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("create_year")}
                      >
                        제조년도
                        {sortField === "create_year" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("create_company")}
                      >
                        제조사
                        {sortField === "create_company" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header table-header-last"
                        onClick={() => sortAssets("status")}
                      >
                        폐기 유무
                        {sortField === "status" && sortOrder !== "none" && (
                          <span className="sortIcon">
                            {sortOrder === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {disposeAssets.length > 0 ? (
                      disposeAssets.map((asset) => (
                        <tr
                          key={asset.asset_number}
                          className={
                            selectedDisposeAssets.includes(asset.asset_number)
                              ? "selected-row"
                              : ""
                          }
                        >
                          <td className="table-cell table-cell-select">
                            <input
                              type="checkbox"
                              checked={selectedDisposeAssets.includes(
                                asset.asset_number
                              )}
                              onChange={() =>
                                handleDisposeAssetSelect(asset.asset_number)
                              }
                            />
                          </td>
                          <td className="table-cell">{asset.asset_number}</td>
                          <td className="table-cell">{asset.asset_name}</td>
                          <td className="table-cell">
                            {asset.asset_price.toLocaleString()}원
                          </td>
                          <td className="table-cell">
                            {asset.charge_department}
                          </td>
                          <td className="table-cell">{asset.create_year}</td>
                          <td className="table-cell">
                            {asset.create_company || "-"}
                          </td>
                          <td
                            className={`table-cell table-cell-last ${
                              asset.status === "사용"
                                ? "status-cell-use"
                                : asset.status === "폐기"
                                ? "status-cell-dispose"
                                : "status-cell-default"
                            }`}
                          >
                            {asset.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="table-row">
                        <td
                          colSpan={8}
                          className="table-cell"
                          style={{ padding: 0, borderBottom: "none" }}
                        >
                          <div className="no-data-wrapper">
                            <div className="no-data-message">
                              선택된 자산이 없습니다
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="disposeLowerSection">
              <div className="sectionHeader">
                <span className="section_header_span">
                  조회된 자산 (사용 상태)
                </span>
                <div className="section_header_btn">
                  <button
                    className="selectAllButton"
                    onClick={handleSelectAllAssets}
                  >
                    {selectedAssets.length === filteredAssets.length
                      ? "전체 해제"
                      : "전체 선택"}
                  </button>
                  <button className="moveButton" onClick={handleMoveUp}>
                    <ArrowUpwardIcon
                      style={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    위로 이동
                  </button>
                </div>
              </div>
              <div
                className={`tableContainer ${
                  showTable &&
                  filteredAssets.filter((asset) => asset.status === "사용")
                    .length > 0
                    ? "table-container-auto"
                    : "table-container-hidden"
                }`}
              >
                <table className="table">
                  <thead>
                    <tr className="table-row">
                      <th className="table-header table-cell-select">선택</th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("asset_number")}
                      >
                        자산번호
                        {sortField === "asset_number" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("asset_name")}
                      >
                        물품명
                        {sortField === "asset_name" && sortOrder !== "none" && (
                          <span className="sortIcon">
                            {sortOrder === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("asset_price")}
                      >
                        가격
                        {sortField === "asset_price" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("charge_department")}
                      >
                        담당부서
                        {sortField === "charge_department" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("create_year")}
                      >
                        제조년도
                        {sortField === "create_year" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header"
                        onClick={() => sortAssets("create_company")}
                      >
                        제조사
                        {sortField === "create_company" &&
                          sortOrder !== "none" && (
                            <span className="sortIcon">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                      </th>
                      <th
                        className="table-header table-header-last"
                        onClick={() => sortAssets("status")}
                      >
                        폐기 유무
                        {sortField === "status" && sortOrder !== "none" && (
                          <span className="sortIcon">
                            {sortOrder === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {showTable &&
                    filteredAssets.filter((asset) => asset.status === "사용")
                      .length > 0 ? (
                      filteredAssets
                        .filter((asset) => asset.status === "사용")
                        .map((asset) => (
                          <tr
                            key={asset.asset_number}
                            className={
                              selectedAssets.includes(asset.asset_number)
                                ? "selected-row"
                                : ""
                            }
                          >
                            <td className="table-cell table-cell-select">
                              <input
                                type="checkbox"
                                checked={selectedAssets.includes(
                                  asset.asset_number
                                )}
                                onChange={() =>
                                  handleAssetSelect(asset.asset_number)
                                }
                              />
                            </td>
                            <td className="table-cell">{asset.asset_number}</td>
                            <td className="table-cell">{asset.asset_name}</td>
                            <td className="table-cell">
                              {asset.asset_price.toLocaleString()}원
                            </td>
                            <td className="table-cell">
                              {asset.charge_department}
                            </td>
                            <td className="table-cell">{asset.create_year}</td>
                            <td className="table-cell">
                              {asset.create_company || "-"}
                            </td>
                            <td
                              className={`table-cell table-cell-last ${
                                asset.status === "사용"
                                  ? "status-cell-use"
                                  : asset.status === "폐기"
                                  ? "status-cell-dispose"
                                  : "status-cell-default"
                              }`}
                            >
                              {asset.status}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr className="table-row">
                        <td
                          colSpan={8}
                          className="table-cell"
                          style={{ padding: 0, borderBottom: "none" }}
                        >
                          <div className="no-data-wrapper">
                            <div className="no-data-message">
                              검색을 해주세요
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`tableContainer ${
              showTable && filteredAssets.length > 0
                ? "table-container-auto"
                : "table-container-hidden"
            }`}
          >
            <table className="table">
              <thead>
                <tr className="table-row">
                  <th
                    className="table-header"
                    onClick={() => sortAssets("asset_number")}
                  >
                    자산번호
                    {sortField === "asset_number" && sortOrder !== "none" && (
                      <span className="sortIcon">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="table-header"
                    onClick={() => sortAssets("asset_name")}
                  >
                    물품명
                    {sortField === "asset_name" && sortOrder !== "none" && (
                      <span className="sortIcon">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="table-header"
                    onClick={() => sortAssets("asset_price")}
                  >
                    가격
                    {sortField === "asset_price" && sortOrder !== "none" && (
                      <span className="sortIcon">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="table-header"
                    onClick={() => sortAssets("charge_department")}
                  >
                    담당부서
                    {sortField === "charge_department" &&
                      sortOrder !== "none" && (
                        <span className="sortIcon">
                          {sortOrder === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                  </th>
                  <th
                    className="table-header"
                    onClick={() => sortAssets("create_year")}
                  >
                    제조년도
                    {sortField === "create_year" && sortOrder !== "none" && (
                      <span className="sortIcon">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="table-header"
                    onClick={() => sortAssets("create_company")}
                  >
                    제조사
                    {sortField === "create_company" && sortOrder !== "none" && (
                      <span className="sortIcon">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="table-header table-header-last"
                    onClick={() => sortAssets("status")}
                  >
                    폐기 유무
                    {sortField === "status" && sortOrder !== "none" && (
                      <span className="sortIcon">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {showTable && filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr
                      key={asset.asset_number}
                      className={
                        selectedAssets.includes(asset.asset_number)
                          ? "selected-row"
                          : ""
                      }
                    >
                      <td className="table-cell">{asset.asset_number}</td>
                      <td className="table-cell">{asset.asset_name}</td>
                      <td className="table-cell">
                        {asset.asset_price.toLocaleString()}원
                      </td>
                      <td className="table-cell">{asset.charge_department}</td>
                      <td className="table-cell">{asset.create_year}</td>
                      <td className="table-cell">
                        {asset.create_company || "-"}
                      </td>
                      <td
                        className={`table-cell table-cell-last ${
                          asset.status === "사용"
                            ? "status-cell-use"
                            : asset.status === "폐기"
                            ? "status-cell-dispose"
                            : "status-cell-default"
                        }`}
                      >
                        {asset.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="table-row">
                    <td
                      colSpan={7}
                      className="table-cell"
                      style={{ padding: 0, borderBottom: "none" }}
                    >
                      <div className="no-data-wrapper">
                        <div className="no-data-message">검색을 해주세요</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AssetModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        assets={assets}
        departmentList={departmentList}
        years={years}
        months={months}
        days={days}
        fetchAssets={fetchAssets}
      />
    </div>
  );
};

export default AssetPage;
