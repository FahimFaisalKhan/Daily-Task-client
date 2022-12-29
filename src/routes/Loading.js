import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/authSlice";
import Spinner from "../Shared/Spinner/Spinner";

const Loading = ({ children }) => {
  const { loading, dataLoading } = useSelector(selectUser);

  if (loading) {
    return <Spinner />;
  } else {
    return children;
  }
};

export default Loading;
