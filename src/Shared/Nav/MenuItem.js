import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, signOutUser } from "../../redux/authSlice";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];

export const MenuItem = ({ i }) => {
  const dispatch = useDispatch();
  const style = { border: `2px solid ${colors[i]}` };
  return (
    <motion.li
      className="li"
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        onClick={
          i.name === "Sign out" &&
          (() => {
            dispatch(signOutUser());
            dispatch(logout());
          })
        }
        to={i.route}
        className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem]"
      >
        {i.name}
      </Link>
    </motion.li>
  );
};
