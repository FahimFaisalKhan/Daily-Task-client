import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleSign, logInUser, selectUser } from "../../redux/authSlice";
import { MdEmail } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMode } from "../../hooks/useMode";

const SignIn = () => {
  const dispatch = useDispatch();
  const { loading, userLoading, googleLoading, darkMode } =
    useSelector(selectUser);
  useMode(darkMode);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectRoute = location.state?.from?.pathname || "/";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const email = form.email.value;
    const pass = form.password.value;

    // const image = URL.createObjectURL(file);

    const { succeded, error } = await dispatch(
      logInUser({ email: email, password: pass })
    );
    console.log(succeded, error);

    if (succeded) {
      toast.success("Logged in Successfully");
      navigate("/");
    } else {
      toast.error(error);
    }
  };

  const handleGoogleSignin = async () => {
    const { succeded, error } = await dispatch(googleSign());
    if (succeded) {
      toast.success("Signed in Successfully");
      navigate(redirectRoute);
    } else {
      toast.error(error);
    }
  };
  console.log(loading);
  return (
    <div className="container mx-auto my-20 flex flex-col lg:flex-row   ">
      <div className="w-full lg:w-[48%] md:px-24  lg:px-20 xl:px-32">
        <h2
          className={`text-2xl ${
            darkMode ? "text-light" : "text:dark"
          } text-center px-1`}
        >
          Sign in
        </h2>
        <form onSubmit={handleSubmit} className="my-8">
          <div className="mb-6">
            <label
              htmlFor="email"
              className={`block mb-2  font-medium ${
                darkMode ? "text-light" : "text-dark"
              } text-base`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className={`block mb-2  font-medium ${
                darkMode ? "text-light" : "text-dark"
              } text-base`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 relative text-white bg-secondary  focus:ring-4 focus:outline-none  font-medium rounded-lg text-base w-full  px-5 py-2.5 text-center inline-flex items-center justify-center"
            disabled={userLoading}
          >
            {userLoading ? (
              <ClipLoader
                color="#a69cac"
                aria-label="Loading Spinner"
                data-testid="loader"
                loading={true}
                size={25}
              />
            ) : (
              "Log in"
            )}
          </button>
        </form>
        <p className="text-base font-semibold mt-2 pt-1 mb-0">
          <span className={`${darkMode ? "text-light" : "text-dark"}`}>
            {" "}
            Don't have an account?
          </span>
          <Link
            to="/signup"
            className="text-red-600 hover:text-red-700 focus:text-red-700  ml-2"
          >
            register
          </Link>
        </p>
      </div>
      <div className="w-full lg:w-[4%] min-h-[4rem] flex justify-center items-center ">
        <p className="h-0  lg:h-full w-full lg:w-0 flex justify-center items-center border-b-2 lg:border-b-0 lg:border-l-2 ">
          <span
            className={`mr-1 ${
              darkMode ? "bg-dark text-light" : "bg-white text-dark"
            } py-2`}
          >
            OR
          </span>
        </p>
      </div>
      <div className="w-full lg:w-[48%] text-center flex items-center justify-center flex-col">
        <button
          onClick={handleGoogleSignin}
          disabled={googleLoading}
          className="w-10/12 lg:w-7/12 px-6 py-3  font-semibold text-gray-900 bg-white border-2 border-gray-500 rounded-md shadow outline-none hover:bg-blue-50 hover:border-blue-400 focus:outline-none text-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`inline w-4 h-4 mr-3 -ml-4 text-gray-900 fill-current ${
              googleLoading && "hidden"
            }`}
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          {googleLoading ? (
            <ClipLoader
              color="#a69cac"
              aria-label="Loading Spinner"
              data-testid="loader"
              loading={true}
              size={25}
            />
          ) : (
            "Sign in with Google"
          )}
        </button>
        <button
          type="button"
          className="w-10/12 lg:w-7/12 mt-7  text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-md text-md px-6 py-3 text-center inline-flex items-center justify-center dark:focus:ring-[#3b5998]/55  mb-2"
        >
          <svg
            className="mr-2 -ml-1 w-4 h-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="facebook-f"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
            ></path>
          </svg>
          Sign in with Facebook
        </button>
        <button
          type="button"
          className="w-10/12 lg:w-7/12 mt-6  text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary/50 font-medium rounded-md text-md px-6 py-3 text-center inline-flex items-center justify-center dark:focus:ring-primary/55  mb-2 gap-x-2"
        >
          <MdEmail className="mr-4 -ml-4" />
          <span> Sign up with Email</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
