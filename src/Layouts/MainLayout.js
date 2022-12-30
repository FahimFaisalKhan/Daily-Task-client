import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { authListener, selectUser } from "../redux/authSlice";
import Foot from "../Shared/Foot/Foot";
import Nav from "../Shared/Nav/Nav";

const MainLayout = () => {
  const dispatch = useDispatch();
  // const { darkMode } = useSelector(selectUser);
  (async () => await dispatch(authListener()))();

  return (
    <div className={`relative  `}>
      <div className="min-h-[100vh]">
        <Nav />
        <Outlet />
      </div>

      <Foot />
    </div>
  );
};

export default MainLayout;
