import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { authListener, selectUser } from "../redux/authSlice";
import Nav from "../Shared/Nav/Nav";

const MainLayout = () => {
  const dispatch = useDispatch();

  (async () => await dispatch(authListener()))();

  return (
    <div className="relative">
      <Nav />
      <Outlet />
    </div>
  );
};

export default MainLayout;
