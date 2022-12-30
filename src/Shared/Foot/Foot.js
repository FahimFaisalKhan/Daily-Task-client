import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";

const Foot = () => {
  const { darkMode } = useSelector(selectUser);
  return (
    <div
      className={`px-32  pb-52 pt-5 flex justify-center items-start gap-x-5 ${
        darkMode ? "bg-black" : "bg-gray-300"
      }`}
    >
      <p
        className={`${
          darkMode ? "text-gray-200" : "text-black"
        } text-lg font-semibold`}
      >
        &#169; Fahim Faisal Khan. ALl rights reserverd.
      </p>
    </div>
  );
};

export default Foot;
