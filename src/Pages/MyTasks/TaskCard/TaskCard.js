import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "../../../redux/authSlice";
import { GiIceBomb } from "react-icons/gi";
import "./TaskCard.css";
import axios from "axios";
const TaskCard = ({ index, task, refetch }) => {
  const { _id, addedon, completed, taskName, description, deadline } = task;
  const [isCompleted, setIsCompleted] = useState(completed);
  let formatedDeadline;
  if (deadline && deadline !== "Invalid Date") {
    formatedDeadline = new Date(deadline).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } else {
    formatedDeadline = "No deadline specified";
  }
  console.log(deadline === "Invalid Date", deadline);

  const handleCompleted = async () => {
    const { data } = await axios.put(
      "https://daily-task-server-fahimfaisalkhan.vercel.app/task-completed",
      {
        id: _id,
      }
    );

    if (data.modifiedCount > 0) {
      setIsCompleted(true);
      refetch();
    }
  };
  const handleDelete = async (id) => {
    const { data } = await axios.delete(
      "https://daily-task-server-fahimfaisalkhan.vercel.app/task",
      {
        data: { id },
      }
    );
    console.log(data);
    if (data.acknowledged) {
      refetch();
    }
  };

  return (
    <div className="mt-12 mb-16">
      <div className="w-full bg-tertiary flex flex-col sm:flex-row gap-y-12  py-10 items-center justify-around rounded-lg hover:scale-105 hover:shadow-lg hover:-translate-y-2.5 hover:bg-light transition-all">
        <div className="w-full sm:w-6/12 lg:w-8/12 px-2 flex flex-col  ">
          <div className="flex  sm:px-16 gap-6 items-center mb-4 ">
            <h2 className="rounded-full w-5 h-5 text-center   border-2 border-primary flex items-center justify-center text-xl p-4 index">
              <p>{index}</p>
            </h2>
            <h3 className="font-medium text-xl text-dark">
              {taskName === "" ? "Name not set" : taskName}
            </h3>
          </div>
          <p className="sm:px-16 flex items-center text-base mb-4">
            {description
              ? description.split(" ").splice(0, 20).join(" ") + "....."
              : "No description added"}
          </p>
          {formatedDeadline && (
            <>
              <p className="sm:px-16 flex items-center text-sm font-semibold text-red-700 my-0 mb-1 gap-x-1">
                <span className="inline-flex items-center">
                  <GiIceBomb />
                </span>
                <span className="inline-flex items-center">Deadline</span>
              </p>
              <p className="sm:px-16 flex items-center text-sm font-normal text-dark ml-[2px]">
                {formatedDeadline}
              </p>
            </>
          )}
        </div>

        <div className="flex w-full sm:w-6/12 lg:w-4/12 justify-center flex-col xl:flex-row  gap-2 sm:gap-6 pl-2 sm:pl-auto">
          <Link to={`/detail/${_id}`} state={{ from: "update" }}>
            <button
              className={`inline-block w-36 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
            >
              {" "}
              Update
            </button>
          </Link>

          <button
            onClick={handleCompleted}
            className={`inline-block w-36 ${
              isCompleted
                ? " text-gray-400 bg-gradient-to-r from-green-100 via-green-200 to-green-300"
                : "  text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 "
            }  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 inline-flex justify-around items-center gap-x-2`}
            disabled={completed}
          >
            <span className="w-7/12">Completed</span>{" "}
            <input
              checked={completed}
              id="green-checkbox"
              type="checkbox"
              value=""
              className="checkbox-round w-5/12"
            />
          </button>
          <button
            onClick={() => handleDelete(task._id)}
            className="inline-block w-36 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="w-full text-start sm:text-end mt-4 ">
        <Link to={`/detail/${_id}`}>
          <button
            type="button"
            class="text-light bg-primary hover:bg-primary  font-medium  text-base py-3 px-3 text-center inline-flex items-center rounded-full w-12 h-12 justify-center active:scale-90 transition-transform md:mr-7"
          >
            <svg
              aria-hidden="true"
              class=" w-5 h-5"
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
    </div>
  );
};

export default TaskCard;
