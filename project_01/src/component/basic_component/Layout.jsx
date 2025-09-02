import { useEffect, useState } from "react";
import Nav from "./Nav";
import "../../component_css/basic_component_css/Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
const Layout = () => {
  return (
    <div>
      <div className="wrap">
        <header className="header"></header>
        <Nav />
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
