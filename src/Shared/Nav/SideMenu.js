import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, signOutUser } from "../../redux/authSlice";
import ModeToggleBtn from "./ModeToggleBtn/ModeToggleBtn";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const SideMenu = ({ isOpen, user, dispatch }) => (
  <motion.ul
    className={` ${isOpen ? "ul nav" : "hidden"} `}
    variants={variants}
  >
    <Link
      to={"/"}
      className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
    >
      <MenuItem item={"My Tasks"} />
    </Link>
    <Link
      to={"/add"}
      className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
    >
      <MenuItem item={"Add Tasks"} />
    </Link>
    <Link
      to={"/completed"}
      className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
    >
      {" "}
      <MenuItem item={"Completed Tasks"} />
    </Link>
    <Link
      to={"/completed"}
      className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
    >
      {" "}
      <MenuItem item={"Completed Tasks"} />
    </Link>
    {!user && (
      <>
        <Link
          to={"/signin"}
          className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
        >
          {" "}
          <MenuItem item={"Sign In"} />
        </Link>
        <Link
          to={"/Signup"}
          className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
        >
          {" "}
          <MenuItem item={"Sign up"} />
        </Link>
      </>
    )}
    {user && (
      <Link
        onClick={() => {
          dispatch(signOutUser());
          dispatch(logout());
        }}
        to={"/"}
        className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]"
      >
        {" "}
        <MenuItem item={"Sign Out"} />
      </Link>
    )}
    <Link className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-primary text-[1rem]">
      {" "}
      <MenuItem item={<ModeToggleBtn />} />
    </Link>
  </motion.ul>
);

const itemIds = [
  { name: "My Tasks", route: "/" },
  { name: "Add Tasks", route: "/add" },
  { name: "Completed Tasks", route: "/completed" },
  { name: "Sign out", route: "/" },
  { name: "Sign in", route: "/signin" },
  { name: "Sign up", route: "/signup" },
];
