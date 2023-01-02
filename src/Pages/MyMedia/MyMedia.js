import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMode } from "../../hooks/useMode";
import { selectUser } from "../../redux/authSlice";
import Spinner from "../../Shared/Spinner/Spinner";
import loga from "../../Static/loga.png";

const MyMedia = () => {
  const { darkMode, user } = useSelector(selectUser);
  useMode(darkMode);
  const { data: images, isLoading } = useQuery({
    queryKey: ["task-images"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://daily-task-server-fahimfaisalkhan.vercel.app/task-images?email=${user?.email}`
      );
      return data;
    },
  });
  if (isLoading) {
    return <Spinner />;
  }
  if (images.length > 0) {
    return (
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 container mx-auto my-32 justify-center text-center gap-x-1 gap-y-16">
        {images.map(
          (image) =>
            image.image && (
              <div className="flex flex-col items-center rounded-lg  max-h-[35rem]">
                <img
                  src={image.image}
                  alt=""
                  className="max-w-[100%] text-center  max-h-[100%]  rounded-lg grow"
                />
                <Link to={`/detail/${image._id}`} className="self-center mt-4">
                  <button
                    type="button"
                    className={`text-light bg-primary hover:bg-primary  font-medium  text-base py-3 px-3 text-center inline-flex items-center rounded-full w-12 h-12 justify-center active:scale-90 transition-transform md:mr-7 ${
                      darkMode ? "border-2 border-light" : ""
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      className=" w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </Link>
              </div>
            )
        )}
      </div>
    );
  }
  return (
    <h2
      className={`text-2xl ${
        darkMode ? "text-light" : "text-dark"
      } font-semibold px-1  text-center mt-20`}
    >
      No Media Available!
    </h2>
  );
};

export default MyMedia;
