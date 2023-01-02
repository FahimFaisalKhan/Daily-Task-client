import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fbSignin,
  googleSign,
  selectUser,
  signUpUser,
} from "../../redux/authSlice";
import { MdEmail } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMode } from "../../hooks/useMode";

const Signup = () => {
  const inputImg = useRef(null);
  const dispatch = useDispatch();
  const { loading, userLoading, googleLoading, darkMode } =
    useSelector(selectUser);
  const [droppedImage, setDroppedImage] = useState("");
  const [fbLoading, setFbLoading] = useState(false);
  useMode(darkMode);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const pass = form.password.value;
    const file = form.dropzoneFile.files[0];
    // const image = URL.createObjectURL(file);

    const { succeded, error } = await dispatch(
      signUpUser({ email: email, password: pass, file: file, name: name })
    );
    console.log(succeded, error);

    if (succeded) {
      toast.success("User created Successfully");
      navigate("/");
    } else {
      toast.error(error);
    }
  };

  const handleGoogleSignin = async () => {
    const { succeded, error } = await dispatch(googleSign());
    if (succeded) {
      toast.success("Signed in Successfully");

      navigate("/");
    } else {
      toast.error(error);
    }
  };
  const handleFbSignIn = async () => {
    setFbLoading(true);
    const { succeded, error } = await dispatch(fbSignin());
    if (succeded) {
      toast.success("Signed in Successfully");
      setFbLoading(false);
      navigate("/");
    } else {
      setFbLoading(false);
      console.log(error);
      toast.error(error);
    }
  };
  console.log(loading);
  return (
    <div className="container mx-auto my-20 flex flex-col lg:flex-row">
      <div className="w-full lg:w-[48%] md:px-24  lg:px-20 xl:px-32">
        <h2
          className={`text-2xl ${
            darkMode ? "text-light" : "text:dark"
          } text-center px-1`}
        >
          Sign up
        </h2>
        <form onSubmit={handleSubmit} className="my-8">
          <div className="mb-6">
            <label
              htmlFor="name"
              className={`block mb-2  font-medium ${
                darkMode ? "text-light" : "text-dark"
              } text-base`}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
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
              htmlFor="password"
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

          <div className="mt-14 mb-12">
            <div className="flex items-center justify-center w-full ">
              <label
                htmlFor="dropzoneFile"
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
                  darkMode ? "bg-transparent" : "bg-gray-50 "
                }`}
              >
                <div
                  className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                    droppedImage && "hidden"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400  "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <div className={`relative h-full ${!droppedImage && "hidden"}`}>
                  <img
                    src={droppedImage}
                    className={`max-h-full  ${!droppedImage && "hidden"}`}
                    alt=""
                  />
                  <button
                    onClick={() => {
                      inputImg.current.value = "";
                      setDroppedImage("");
                    }}
                    type="button"
                    className="w-8 h-8 text-white bg-secondary font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center justify-center mr-2 absolute -top-3 -right-5 z-20"
                  >
                    ✕<span className="sr-only">Icon description</span>
                  </button>
                </div>

                <input
                  ref={inputImg}
                  className="block w-full h-full absolute top-0  opacity-0  hover:cursor-pointer"
                  id="dropzoneFile"
                  name="dropzoneFile"
                  type="file"
                  onChange={(e) => {
                    const img = URL.createObjectURL(e.target.files[0]);
                    console.log(img);
                    setDroppedImage(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="relative text-white bg-secondary  focus:ring-4 focus:outline-none  font-medium rounded-lg text-base w-full  px-5 py-2.5 text-center inline-flex items-center justify-center"
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
              "Sign up"
            )}
          </button>
        </form>
        <p className="text-base font-semibold mt-2 pt-1 mb-0">
          <span className={`${darkMode ? "text-light" : "text-dark"}`}>
            {" "}
            Already have an account?
          </span>
          <Link
            to="/signin"
            className="text-red-600 hover:text-red-700 focus:text-red-700  ml-2"
          >
            Login
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
            "Sign up with Google"
          )}
        </button>
        <button
          onClick={handleFbSignIn}
          type="button"
          className="w-10/12 lg:w-7/12 mt-7  text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-md text-md px-6 py-3 text-center inline-flex items-center justify-center dark:focus:ring-[#3b5998]/55  mb-2"
        >
          {fbLoading ? (
            <ClipLoader
              color="#a69cac"
              aria-label="Loading Spinner"
              data-testid="loader"
              loading={true}
              size={25}
            />
          ) : (
            <>
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
              Sign up with Facebook
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Signup;
