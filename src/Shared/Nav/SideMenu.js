import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useSelector } from "react-redux";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const SideMenu = ({ isOpen }) => (
  <motion.ul
    className={` ${isOpen ? "ul nav" : "hidden"} `}
    variants={variants}
  >
    {itemIds.map((i) => (
      <MenuItem i={i} key={i} />
    ))}
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
