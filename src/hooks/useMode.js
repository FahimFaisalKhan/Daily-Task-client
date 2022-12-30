import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useMode = (darkMode) => {
  useEffect(() => {
    if (darkMode) {
      document.getElementsByTagName("html")[0].style.backgroundColor =
        "#0d0c1d";
    } else {
      document.getElementsByTagName("html")[0].style.backgroundColor = "white";
    }
  }, [darkMode]);
};
