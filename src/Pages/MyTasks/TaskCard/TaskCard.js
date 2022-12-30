import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { increment, selectUser } from "../../../redux/authSlice";
import { GiIceBomb } from "react-icons/gi";
import "./TaskCard.css";
import axios from "axios";
import { add } from "date-fns";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
const TaskCard = ({ index, task, refetch }) => {
  const { _id, addedon, completed, taskName, description, deadline } = task;
  const { darkMode } = useSelector(selectUser);

  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
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

  const handleCompleted = async () => {
    setCompleting(true);
    try {
      const { data } = await axios.put("http://localhost:5000/task-completed", {
        id: _id,
      });

      if (data.modifiedCount > 0) {
        refetch();
        setCompleting(false);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Something went wrong try again");
      setCompleting(false);
    }
  };
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const { data } = await axios.delete("http://localhost:5000/task", {
        data: { id },
      });
      console.log(data);
      if (data.acknowledged) {
        refetch();
        setDeleting(false);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Something went wrong try deleting again");
      setDeleting(false);
    }
  };

  return (
    <div className="mt-12 mb-16">
      <div
        className={`w-full ${
          darkMode
            ? "bg-primary text-light hover:bg-secondary"
            : "bg-tertiary text-dark hover:bg-light"
        }  flex flex-col sm:flex-row gap-y-6  py-10 items-center justify-around rounded-lg hover:scale-105 hover:shadow-lg hover:-translate-y-2.5  transition-all card`}
      >
        <div className="w-full sm:w-6/12 lg:w-8/12 px-2 flex flex-col  gap-y-6">
          <div className="flex  sm:px-16 gap-6 items-center mb-4 ">
            <h2
              className={`rounded-full w-5 h-5 text-center   border-2 ${
                darkMode ? "border-light" : "border-primary"
              } flex items-center justify-center text-xl p-4 index `}
            >
              <p>{index}</p>
            </h2>
            <h3
              className={`font-medium text-xl ${
                darkMode ? "text-light" : "text-dark"
              } `}
            >
              {taskName === "" ? "Name not set" : taskName}
            </h3>
          </div>
          <p className="sm:px-16 flex items-center text-base mb-4">
            {description
              ? description.split(" ").splice(0, 20).join(" ") + "....."
              : "No description added"}
          </p>
          {formatedDeadline && (
            <div>
              <p className="sm:px-16 flex items-center text-sm font-semibold text-red-700 my-0 mb-1 gap-x-1">
                <span className="inline-flex items-center">
                  <GiIceBomb />
                </span>
                <span className="inline-flex items-center">Deadline</span>
              </p>
              <p
                className={`sm:px-16 flex items-center text-sm font-normal ${
                  darkMode ? "text-light" : "text-dark"
                } ml-[2px]`}
              >
                {formatedDeadline}
              </p>
            </div>
          )}
        </div>
        <div className="w-full sm:w-6/12 lg:w-4/12 flex flex-col 2xl:justify-between 2xl:gap-16 ">
          <div className="flex self-center justify-center flex-col 2xl:flex-row  gap-2 sm:gap-2  px-2 sm:pl-auto ">
            <Link to={`/detail/${_id}`} state={{ from: "update" }}>
              <button
                className={` inline-block w-36 text-primary bg-light hover:bg-gradient-to-br   font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ${
                  !darkMode ? "up-btn" : ""
                } `}
              >
                {" "}
                Update
              </button>
            </Link>

            <button
              onClick={handleCompleted}
              className={` w-36 
               
                   text-light bg-dark hover:bg-gradient-to-br  disabled:opacity-70 disabled:text-gray-500 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 inline-flex justify-around items-center gap-x-2`}
              disabled={completed}
            >
              {completing ? (
                <ClipLoader
                  color="#a69cac"
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  loading={true}
                  size={22}
                />
              ) : (
                <>
                  <span className={`w-7/12`}>Completed</span>{" "}
                  <input
                    checked={completed}
                    id="green-checkbox"
                    type="checkbox"
                    value=""
                    className="checkbox-round w-5/12"
                  />
                </>
              )}
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="  w-36 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center
              inline-flex justify-center items-center mr-2 mb-2"
            >
              {deleting ? (
                <ClipLoader
                  color="#a69cac"
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  loading={true}
                  size={22}
                />
              ) : (
                <span> Delete</span>
              )}
            </button>
          </div>
          <p className="px-4 self-end sm:self-center 2xl:self-end mt-5 text-sm  ">
            Added-on -<i> {addedon}</i>
          </p>
        </div>
      </div>

      <div className="w-full text-start sm:text-end mt-4 ">
        <Link to={`/detail/${_id}`}>
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
    </div>
  );
};

export default TaskCard;
