import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectUser } from "../redux/authSlice";
import Spinner from "../Shared/Spinner/Spinner";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useSelector(selectUser);
  console.log(user);
  if (loading) {
    return <Spinner />;
  }
  if (user?.displayName) {
    return children;
  }

  return <Navigate to="/signin" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
