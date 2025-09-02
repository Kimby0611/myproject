import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import "../../component_css/asset_css/Asset.css"; // CSS 임포트

// 디바운싱 훅
const useDebouncedState = (initialState, delay) => {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedState] = useState(initialState);
  const timeoutRef = useRef(null);

  const updateState = useCallback(
    (newState) => {
      setState(newState);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDebouncedState(newState);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [state, debouncedState, updateState];
};

// 입력 필드 컴포넌트
const InputField = memo(
  ({ label, value, onChange, placeholder, type = "text", style, error }) => (
    <Box
      style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
    >
      <Typography
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#1a1a1a",
          width: "100px",
          marginRight: "15px",
        }}
      >
        {label}
      </Typography>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          fontSize: "12px",
          padding: "2px",
          backgroundColor: "#fafafa",
          border: "1px solid #666",
          borderRadius: "4px",
          width: "180px",
          height: "30px",
          ...style,
        }}
      />
      {error && (
        <Typography
          style={{ color: "red", fontSize: "12px", marginLeft: "10px" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  ),
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.onChange === nextProps.onChange
);

// 날짜 선택 컴포넌트
const DateSelectField = memo(
  ({
    createYear,
    setCreateYear,
    createMonth,
    setCreateMonth,
    createDay,
    setCreateDay,
    years,
    months,
    days,
  }) => (
    <Box
      style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
    >
      <Typography
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#1a1a1a",
          width: "100px",
          marginRight: "15px",
        }}
      >
        제조년도
      </Typography>
      <select
        value={createYear}
        onChange={(e) => setCreateYear(e.target.value)}
        style={{
          fontSize: "12px",
          backgroundColor: "#fafafa",
          border: "1px solid #666",
          borderRadius: "4px",
          width: "90px",
          height: "30px",
          marginRight: "2px",
        }}
      >
        <option value="">년</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        value={createMonth}
        onChange={(e) => setCreateMonth(e.target.value)}
        style={{
          fontSize: "12px",
          backgroundColor: "#fafafa",
          border: "1px solid #666",
          borderRadius: "4px",
          width: "60px",
          height: "30px",
          marginRight: "2px",
        }}
      >
        <option value="">월</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={createDay}
        onChange={(e) => setCreateDay(e.target.value)}
        style={{
          fontSize: "12px",
          backgroundColor: "#fafafa",
          border: "1px solid #666",
          borderRadius: "4px",
          width: "60px",
          height: "30px",
          marginRight: "2px",
        }}
      >
        <option value="">일</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </Box>
  ),
  (prevProps, nextProps) =>
    prevProps.createYear === nextProps.createYear &&
    prevProps.createMonth === nextProps.createMonth &&
    prevProps.createDay === nextProps.createDay &&
    prevProps.setCreateYear === nextProps.setCreateYear &&
    prevProps.setCreateMonth === nextProps.setCreateMonth &&
    prevProps.setCreateDay === nextProps.setCreateDay
);

// 담당부서 선택 컴포넌트
const DepartmentSelect = memo(
  ({ chargeDepartment, setChargeDepartment, departmentList }) => (
    <Box
      style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
    >
      <Typography
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#1a1a1a",
          width: "100px",
          marginRight: "15px",
        }}
      >
        담당부서
      </Typography>
      <select
        value={chargeDepartment}
        onChange={(e) => setChargeDepartment(e.target.value)}
        style={{
          fontSize: "12px",
          backgroundColor: "#fafafa",
          border: "1px solid #666",
          borderRadius: "4px",
          width: "180px",
          height: "30px",
        }}
      >
        <option value="">부서를 선택하세요</option>
        {departmentList.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </Box>
  ),
  (prevProps, nextProps) =>
    prevProps.chargeDepartment === nextProps.chargeDepartment &&
    prevProps.setChargeDepartment === nextProps.setChargeDepartment
);

// 모달 컴포넌트
const AssetModal = memo(
  ({
    open,
    onClose,
    assets,
    departmentList,
    years,
    months,
    days,
    fetchAssets,
  }) => {
    const initialState = {
      assetNumber: "",
      assetName: "",
      assetPrice: "",
      chargeDepartment: "",
      createYear: "",
      createMonth: "",
      createDay: "",
      createCompany: "",
      status: "사용",
      isAssetNumberDuplicate: false,
      saveError: null,
    };

    const [formState, debouncedFormState, updateFormState] = useDebouncedState(
      initialState,
      300
    );
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    useEffect(() => {
      const {
        assetNumber,
        assetName,
        assetPrice,
        chargeDepartment,
        createYear,
        createCompany,
      } = debouncedFormState;
      const allFieldsFilled = [
        assetNumber,
        assetName,
        assetPrice,
        chargeDepartment,
        createYear,
        createCompany,
      ].every((field) => field.trim() !== "");
      setIsSaveButtonDisabled(!allFieldsFilled);
    }, [debouncedFormState]);

    const handleInputChange = useCallback(
      (field) => (e) => {
        updateFormState((prev) => ({ ...prev, [field]: e.target.value }));
      },
      [updateFormState]
    );

    const handleSaveAsset = async () => {
      const {
        assetNumber,
        assetName,
        assetPrice,
        chargeDepartment,
        createYear,
        createMonth,
        createDay,
        createCompany,
      } = debouncedFormState;

      const isDuplicate = assets.some(
        (asset) => asset.asset_number === assetNumber.trim()
      );
      if (isDuplicate) {
        updateFormState((prev) => ({
          ...prev,
          isAssetNumberDuplicate: true,
          saveError: "이미 존재하는 자산번호입니다.",
        }));
        return;
      }

      const createYearValue = createYear
        ? `${createYear}-${createMonth || "01"}-${createDay || "01"}`
        : "";

      const assetToSave = {
        asset_number: assetNumber.trim(),
        asset_name: assetName.trim(),
        asset_price: parseInt(assetPrice) || 0,
        charge_department: chargeDepartment,
        create_year: createYearValue,
        create_company: createCompany.trim(),
        status: "사용",
      };

      try {
        await axios.post("http://localhost:8080/api/assets", assetToSave);
        await fetchAssets();
        alert("등록이 완료되었습니다");
        updateFormState(initialState);
        onClose();
      } catch (error) {
        console.error("Error saving asset:", error);
        updateFormState((prev) => ({
          ...prev,
          saveError: "자산 저장에 실패했습니다. 서버를 확인해주세요.",
        }));
      }
    };

    const handleCloseModal = () => {
      updateFormState(initialState);
      onClose();
    };

    return (
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleCloseModal();
          }
        }}
        maxWidth="sm"
        fullWidth
        disableBackdropClick
        PaperProps={{
          style: {
            backgroundColor: "#f5f5f5",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            border: "1px solid #666",
            borderRadius: "8px",
          },
        }}
      >
        <span className="modalTitle">
          <span className="modalTitleText">자산 등록</span>
          <button onClick={handleCloseModal} className="closeButton">
            <CloseIcon />
          </button>
        </span>
        <DialogContent className="modalContent">
          <InputField
            label="자산번호"
            value={formState.assetNumber}
            onChange={handleInputChange("assetNumber")}
            placeholder="ex) A0001"
            className="modalFormField"
            error={
              formState.isAssetNumberDuplicate
                ? "이미 존재하는 자산번호입니다."
                : null
            }
          />
          <InputField
            label="물품명"
            value={formState.assetName}
            onChange={handleInputChange("assetName")}
            placeholder="ex) 본체"
            className="modalFormField"
          />
          <InputField
            label="가격"
            value={formState.assetPrice}
            onChange={handleInputChange("assetPrice")}
            placeholder="ex) 1000000"
            type="number"
            className="modalFormField"
          />
          <DepartmentSelect
            chargeDepartment={formState.chargeDepartment}
            setChargeDepartment={(value) =>
              updateFormState((prev) => ({ ...prev, chargeDepartment: value }))
            }
            departmentList={departmentList}
          />
          <DateSelectField
            createYear={formState.createYear}
            setCreateYear={(value) =>
              updateFormState((prev) => ({ ...prev, createYear: value }))
            }
            createMonth={formState.createMonth}
            setCreateMonth={(value) =>
              updateFormState((prev) => ({ ...prev, createMonth: value }))
            }
            createDay={formState.createDay}
            setCreateDay={(value) =>
              updateFormState((prev) => ({ ...prev, createDay: value }))
            }
            years={years}
            months={months}
            days={days}
          />
          <InputField
            label="제조사"
            value={formState.createCompany}
            onChange={handleInputChange("createCompany")}
            placeholder="ex) Dell"
            className="modalFormField"
          />
          {formState.saveError && (
            <span className="errorMessage">{formState.saveError}</span>
          )}
        </DialogContent>
        <DialogActions className="modalActions">
          <button
            className={`save-button ${
              isSaveButtonDisabled ? "save-button-disabled" : ""
            }`}
            onClick={handleSaveAsset}
          >
            <CheckIcon className="icon" />
            저장
          </button>
          <button className="cancelButton" onClick={handleCloseModal}>
            <CancelIcon className="icon" />
            취소
          </button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default AssetModal;
