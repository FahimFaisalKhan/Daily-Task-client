import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setDarkMode } from "../../../redux/authSlice";
import "./ModeToggleBtn.css";
const ModeToggleBtn = () => {
  const { darkMode } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [currentModeIsDark, setCurrentModeIsDark] = useState(darkMode);
  const modeRef = useRef(null);
  const handleMode = async () => {
    await dispatch(setDarkMode({ darkMode: !currentModeIsDark }));
    setCurrentModeIsDark(!currentModeIsDark);
  };

  return (
    <div className="scale-[.3] h-5 w-20">
      <input
        type="checkbox"
        id="toggle"
        className="toggle--checkbox"
        ref={modeRef}
        checked={currentModeIsDark}
      />
      <label
        for="toggle"
        className="toggle--label  -left-20 -top-10"
        onClick={handleMode}
      >
        <span className="toggle--label-background"></span>
      </label>
      <div className="background"></div>
    </div>
  );
};

export default ModeToggleBtn;
