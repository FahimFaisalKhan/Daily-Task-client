import React from "react";
import { useSelector } from "react-redux";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useMode } from "../../hooks/useMode";
import { selectUser } from "../../redux/authSlice";

const Spinner = () => {
  const { darkMode } = useSelector(selectUser);
  useMode(darkMode);
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <PropagateLoader
        color={darkMode ? "#a69cac" : "#474973"}
        loading={true}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={2}
      />
    </div>
  );
};

export default Spinner;
