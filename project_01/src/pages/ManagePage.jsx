import ManagePeople from "../component/manage/ManagePeople";

const ManagePage = () => {
  return (
    <div className="manageWrap">
      <h2 className="manageTitle">직원 관리</h2>
      <ManagePeople></ManagePeople>
    </div>
  );
};

export default ManagePage;
