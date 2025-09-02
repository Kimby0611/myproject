// App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MailPage from "./pages/MailPage";
import RegisterFrom from "./component/login_regi/RegisterForm";
import AssetPage from "./pages/AssetPage";
import Electronic from "./pages/Electronic";
import WritePage from "./pages/WritePage";
import PostPage from "./pages/PostPage";
import Notice from "./pages/Notice";
import ManagePage from "./pages/ManagePage";
import { AuthProvider } from "./lib/AuthContext";
import FreeBoard from "./pages/FreeBoard";
import BoardWritePage from "./pages/BoardWritePage";
import BoardPostPage from "./pages/BoardPostPage";
import Layout from "./component/basic_component/Layout";
import MyPage from "./component/login_regi/MyPage";
import CheckPassword from "./component/login_regi/CheckPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterFrom />} />
            <Route path="/mail" element={<MailPage />} />
            <Route path="/elec" element={<Electronic />} />
            <Route path="/assets" element={<AssetPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/WritePage" element={<WritePage />} />
            <Route path="/WritePage/:num" element={<WritePage />} />
            <Route path="/view/:num" element={<PostPage />} />
            <Route path="/freeboard" element={<FreeBoard />} />
            <Route path="/BoardWritePage" element={<BoardWritePage />} />
            <Route path="/BoardWritePage/:num" element={<BoardWritePage />} />
            <Route path="/fview/:num" element={<BoardPostPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
