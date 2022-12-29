import { async } from "@firebase/util";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef } from "react";
import Spinner from "../../../Shared/Spinner/Spinner";

const CompletedTaskCard = ({
  index,
  task,
  handleDelete,
  handleNotCompleted,
  refetch,
}) => {
  const handleComment = async (event) => {
    if (event.key === "Enter") {
      const comment = event.target.value;
      console.log(comment);

      const { data } = await axios.put(
        "https://daily-task-server-fahimfaisalkhan.vercel.app/add-comment",
        {
          id: task._id,
          comment: comment,
        }
      );

      if (data.acknowledged) {
        refetch();
      }
      event.target.value = "";
    }
  };
  return (
    <div className="my-32">
      <div className="w-full bg-tertiary flex flex-col sm:flex-row gap-y-12  py-10 items-center justify-around rounded-lg hover:scale-105 hover:shadow-lg hover:-translate-y-2.5 hover:bg-light transition-all">
        <div className="flex w-full sm:w-6/12 lg:w-8/12 px-2 sm:px-16 gap-6 items-center  ">
          <h2 className="rounded-full w-5 h-5 text-center   border-2 border-primary flex items-center justify-center text-xl p-4 index">
            <p>{index}</p>
          </h2>
          <h3 className="font-medium text-xl text-dark">
            {task.taskName ? task.taskName : "Name not set"}
          </h3>
        </div>
        <div className="flex w-full sm:w-6/12 lg:w-4/12 justify-center  gap-2 sm:gap-6 pl-2 sm:pl-auto">
          <button
            onClick={() => handleNotCompleted(task._id)}
            className="inline-block w-44 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
      <div class="my-6">
        <label
          htmlFor="task-comment"
          class="block mb-2 text-base font-medium text-gray-900"
        >
          Add comment
        </label>
        <textarea
          onKeyDown={handleComment}
          name="task-comment"
          rows="4"
          class="block p-2.5 w-full text-base text-gray-900  rounded-lg border border-gray-300  focus:border-red-500 "
          placeholder="Write your comment here..."
        ></textarea>
      </div>
      <div className="container mx-auto flex flex-col gap-y-4">
        <h2 className="text-2xl text-dark px-1">Comments</h2>
        {task?.comment?.map((comment) => (
          <div class="block  p-6 bg-primary border border-primary rounded-lg shadow-md  ">
            <p class="font-normal text-white">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedTaskCard;
