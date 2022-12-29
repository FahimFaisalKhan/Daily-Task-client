import { useCycle, motion } from "framer-motion";
import React, { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import { MenuToggle } from "./MenuToggle";
import { SideMenu } from "./SideMenu";
import "./Nav.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser, signOutUser } from "../../redux/authSlice";
const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};
const Nav = () => {
  const { user, loading } = useSelector(selectUser);
  console.log(user, loading);
  const dispatch = useDispatch();

  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  return (
    <nav className="p-4  border-gray-200  bg-primary">
      <div className="container flex flex-wrap items-center justify-end sm:justify-between mx-auto">
        <a href=" " className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-6 mr-3 sm:h-10"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Flowbite
          </span>
        </a>
        <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={height}
          ref={containerRef}
          className="inline-flex items-center p-2  text-sm text-gray-500 rounded-lg md:hidden   "
        >
          <motion.div className="background" variants={sidebar} />
          <SideMenu isOpen={isOpen} />
          <MenuToggle toggle={() => toggleOpen()} />
        </motion.nav>

        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link
                to={"/"}
                className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem]"
              >
                My Tasks
              </Link>
            </li>
            <li>
              <Link
                to={"/add"}
                className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem] "
              >
                Add Tasks
              </Link>
            </li>
            <li>
              <Link
                to={"/completed"}
                className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem]"
              >
                Completed Tasks
              </Link>
            </li>
            {!user?.displayName && (
              <>
                <li>
                  <Link
                    to={"/signin"}
                    className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem]"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/signup"}
                    className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem]"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
            {user?.displayName && (
              <li>
                <Link
                  onClick={() => {
                    dispatch(signOutUser());
                    dispatch(logout());
                  }}
                  to={"/signup"}
                  className="block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0 text-white text-[1rem]"
                >
                  Sign out
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
