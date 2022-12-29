import React, { useEffect, useRef, useState } from "react";
import loga from "../../Static/loga.png";
import { MdOutlineDateRange, MdCategory } from "react-icons/md";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../Shared/Spinner/Spinner";
import { GiIceBomb } from "react-icons/gi";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { async } from "@firebase/util";
const TaskDetail = () => {
  // const [task, setTask] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [droppedImage, setDroppedImage] = useState("");
  const [date, setDate] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [editing, setEditing] = useState(false);
  const [taskDeadline, setTaskDeadline] = useState(null);
  const taskDetailImg = useRef(null);
  const detailTitleRef = useRef(null);
  const detailDeadlineRef = useRef(null);
  const detailDesRef = useRef(null);
  const detailYearlineRef = useRef(null);
  const detailMonthlineRef = useRef(null);
  const detailDatelineRef = useRef(null);
  const param = useParams();
  const id = param?.id;
  const location = useLocation();
  console.log(location);

  const {
    isLoading,
    data: task,
    refetch,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://daily-task-server-fahimfaisalkhan.vercel.app/task/${id}`
      );
      console.log(data.deadline);
      if (data.deadline) {
        console.log(data.deadline);
        const dead = new Date(data.deadline);

        setYear(dead.getFullYear());
        setMonth(dead.getMonth() + 1);
        setDate(dead.getDate());

        const d = dead.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        setTaskDeadline(d);
      }

      return data;
    },
  });
  useEffect(() => {
    if (location?.state?.from === "update") {
      setEditing(true);
    }
  }, [location?.state?.from]);
  function isBeforeToday(date) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return date < today;
  }
  const handleSubmit = async () => {
    if (editing) {
      const id = task._id;
      const taskName = detailTitleRef.current.value;

      const description = detailDesRef.current.value;
      const files = taskDetailImg.current.files;
      const year = detailYearlineRef.current.value;
      const month = detailMonthlineRef.current.value;
      const date = detailDatelineRef.current.value;
      console.log(
        (year ? `${year}-` : "") +
          (month ? `${month}-` : "") +
          (date ? date : "")
      );
      let deadline;
      if (year || month || date) {
        const dateString =
          (year ? `${year}-` : "") +
          (month ? `${month}-` : "") +
          (date ? date : "");

        deadline = new Date(dateString);
        const notValidDate = isBeforeToday(deadline);

        if (notValidDate) {
          toast.error("Please enter a date in future");
          return;
        }
      }
      let image;
      if (files.length) {
        const file = files[0];
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=e6e425086757be46a714cf930fe529d6`,
          formData
        );
        image = res.data.data.display_url;
      }

      const { data } = await axios.put(
        "https://daily-task-server-fahimfaisalkhan.vercel.app/task-update",
        {
          id,
          taskName,
          description,
          image,
          deadline,
        }
      );

      console.log(taskName, deadline, description, files[0]);
      if (data.acknowledged) {
        refetch();
      }
    }

    setEditing(!editing);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div class="max-w-7xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
        <div
          id="profile"
          class="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
        >
          <div class="p-4 md:p-12 text-center lg:text-left">
            <div class="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"></div>

            {!editing ? (
              <h1 class="text-3xl font-bold pt-8 lg:pt-0 text-primary">
                {task.taskName ? task.taskName : "No name assigned"}
              </h1>
            ) : (
              <input
                ref={detailTitleRef}
                type="text"
                placeholder="Task name"
                defaultValue={task.taskName && task.taskName}
                autoFocus
                class={`block w-full text-3xl text-gray-900 border border-none rounded-lg 
             bg-white sm:text-xl focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
              />
            )}
            <div class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
            <p class="pt-4 text-primary font-bold flex text-base items-center justify-center lg:justify-start">
              <MdOutlineDateRange className="mr-2 w-1/12" />
              <span className="font-normal mr-2 w-5/12">Added on - </span>{" "}
              <span className="w-6/12">{task.addedon}</span>
            </p>
            <p class="pt-2 text-base text-primary font-bold flex items-center justify-center lg:justify-start ">
              <GiIceBomb className="mr-2 w-1/12" />
              <span className="font-normal mr-2 w-5/12">Deadline - </span>{" "}
              {!editing ? (
                <span className="w-6/12">
                  {taskDeadline ? taskDeadline : "No deadline added"}
                </span>
              ) : (
                <span className="inline-flex justify-start items-start flex-col lg:flex-row w-6/12">
                  <input
                    ref={detailYearlineRef}
                    type="text"
                    placeholder="Year"
                    defaultValue={year}
                    className={`w-10/12 block font-normal  text-gray-900 border-b-2 lg:border-r-2 rounded-sm
             bg-white text-base focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
                  />
                  <input
                    ref={detailMonthlineRef}
                    type="text"
                    placeholder="Month"
                    defaultValue={month}
                    style={{}}
                    className={`w-10/12 block font-normal   text-gray-900 border-b-2 lg:border-r-2 rounded-sm 
             bg-white text-base focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
                  />
                  <input
                    ref={detailDatelineRef}
                    type="text"
                    placeholder="Date"
                    defaultValue={date}
                    style={{}}
                    className={`w-10/12 block font-normal   text-gray-900 border-b-2 lg:border-r-2 rounded-sm 
             bg-white text-base focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
                  />
                </span>
              )}
            </p>

            <p class="pt-8 pl-2 text-sm text-primary">
              {!editing ? (
                <span>
                  {task.description ? task.description : "No description added"}
                </span>
              ) : (
                <textarea
                  ref={detailDesRef}
                  defaultValue={task.description && task.description}
                  name="description"
                  rows="4"
                  class="block p-2.5 w-full text-base text-gray-900  rounded-lg border border-gray-300   "
                  placeholder="Write task description here..."
                ></textarea>
              )}
            </p>

            <div class="pt-12 pb-8">
              <button
                onClick={handleSubmit}
                class="min-w-[7rem] bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
              >
                {editing ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        <div class="lg:w-2/5">
          {!editing ? (
            <div>
              {task?.image ? (
                <img
                  src={task.image}
                  id="pro-img"
                  class="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
                  alt="Task "
                  style={{ height: "32rem", width: "29rem" }}
                />
              ) : (
                <div
                  class="rounded-none lg:rounded-lg shadow-2xl hidden lg:flex justify-center items-center "
                  style={{ height: "32rem", width: "29rem" }}
                >
                  No Task Image Added
                </div>
              )}
            </div>
          ) : (
            <div class=" items-center justify-center w-full hidden lg:flex">
              <label
                htmlFor="dropzoneFile"
                class="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 "
                style={{ height: "32rem", width: "29rem" }}
              >
                <div
                  class={`flex flex-col items-center justify-center pt-5 pb-6 ${
                    droppedImage && "hidden"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    class="w-10 h-10 mb-3 text-gray-400  "
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
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
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
                      taskDetailImg.current.value = null;
                      setDroppedImage("");
                    }}
                    type="button"
                    class="w-8 h-8 text-white bg-secondary font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center justify-center mr-2 absolute -top-3 -right-5 z-20"
                  >
                    ✕<span class="sr-only">Icon description</span>
                  </button>
                </div>

                <input
                  ref={taskDetailImg}
                  class="block w-full h-full absolute top-0  opacity-0  hover:cursor-pointer"
                  accept="image/png, image/gif, image/jpeg"
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
          )}
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-y-4">
        <h2 className="text-2xl text-dark px-1">
          {task.comment?.length ? "Comments" : "No Comments Added"}
        </h2>
        {task?.comment?.map((comment) => (
          <div class="block  p-6 bg-primary border border-primary rounded-lg shadow-md  ">
            <p class="font-normal text-white">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetail;
