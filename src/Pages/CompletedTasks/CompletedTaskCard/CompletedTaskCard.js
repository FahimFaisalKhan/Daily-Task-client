import { async } from "@firebase/util";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../Shared/Spinner/Spinner";

const CompletedTaskCard = ({
  index,
  task,
  handleDelete,
  handleNotCompleted,
  refetch,
  darkMode,
}) => {
  const [savedDisabled, setSavedDisabled] = useState(true);
  const completedCommentAddRef = useRef(null);
  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      await handleComment();
    }
  };

  const handleComment = async () => {
    const comment = completedCommentAddRef.current.value;
    console.log(comment);

    const { data } = await axios.put("http://localhost:5000/add-comment", {
      id: task._id,
      comment: comment,
    });

    if (data.acknowledged) {
      refetch();
      completedCommentAddRef.current.value = "";
      setSavedDisabled(true);
    }
  };
  const handleState = (event) => {
    event.target.value === "" ||
    document.activeElement !== completedCommentAddRef.current
      ? setSavedDisabled(true)
      : setSavedDisabled(false);
  };

  return (
    <div className="my-32">
      <div>
        <div
          className={`w-full ${
            darkMode
              ? "bg-primary hover:bg-secondary"
              : "bg-tertiary hover:bg-light "
          } flex flex-col sm:flex-row gap-y-12  py-10 items-center justify-around rounded-lg hover:scale-105 hover:shadow-lg hover:-translate-y-2.5 transition-all`}
        >
          <div className="flex w-full sm:w-6/12 lg:w-8/12 px-2 sm:px-16 gap-6 items-center  ">
            <h2
              className={`rounded-full w-5 h-5 text-center   border-2 ${
                darkMode ? "border-light text-light" : "border-dark text-dark"
              } flex items-center justify-center text-xl p-4 index`}
            >
              <p>{index}</p>
            </h2>
            <h3
              className={`font-medium text-xl ${
                darkMode ? "text-light" : "text-dark"
              }`}
            >
              {task.taskName ? task.taskName : "Name not set"}
            </h3>
          </div>
          <div className="flex w-full sm:w-6/12 lg:w-4/12 justify-center  gap-2 sm:gap-6 pl-2 sm:pl-auto">
            <button
              onClick={() => handleNotCompleted(task._id)}
              className="inline-block w-44 text-white bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-amber-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Not Completed
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="inline-block w-44 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="w-full text-start sm:text-end mt-4 ">
          <Link to={`/detail/${task?._id}`}>
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
        <div className="my-6 flex flex-col">
          <label
            htmlFor="task-comment"
            className={`block mb-2 text-base font-medium ${
              darkMode ? "text-gray-400" : "text-gray-900"
            }`}
          >
            Add comment
          </label>
          <textarea
            ref={completedCommentAddRef}
            onKeyDown={handleEnter}
            onChange={handleState}
            name="task-comment"
            rows="4"
            className="block p-2.5 w-full text-base text-gray-900  rounded-lg border border-gray-300  "
            placeholder="Write your comment here..."
          ></textarea>

          <button
            onClick={handleComment}
            disabled={savedDisabled}
            className={`py-2 px-4 rounded-md self-end mt-3 bg-primary w-1/12 text-white disabled:opacity-70 disabled:text-gray-300`}
          >
            {" "}
            Save
          </button>
        </div>
        <div className="container mx-auto flex flex-col gap-y-4">
          <h2 className="text-2xl text-dark px-1">Comments</h2>
          {task?.comment?.map((comment) => (
            <div
              className={`block  p-6  border ${
                darkMode
                  ? "bg-secondary border-secondary text-light"
                  : "bg-light border-light text-primary "
              }  rounded-lg shadow-md  `}
            >
              <p className="font-normal ">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedTaskCard;
