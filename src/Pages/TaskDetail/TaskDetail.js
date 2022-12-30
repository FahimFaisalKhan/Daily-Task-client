import React, { useEffect, useRef, useState } from "react";
import loga from "../../Static/loga.png";
import { MdOutlineDateRange, MdCategory } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../Shared/Spinner/Spinner";
import { GiIceBomb } from "react-icons/gi";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import upload from "../../Static/upload.svg";
import { selectUser, setLoading } from "../../redux/authSlice";
import gifloading from "../../Static/loading.gif";
import { ClipLoader } from "react-spinners";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import TaskDetailComments from "./TaskDetailComments";
import { useSelector } from "react-redux";
import { useMode } from "../../hooks/useMode";

const TaskDetail = () => {
  // const [task, setTask] = useState({});
  const { darkMode } = useSelector(selectUser);
  useMode(darkMode);
  const [droppedImage, setDroppedImage] = useState("");
  const [date, setDate] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [editing, setEditing] = useState(false);

  const [taskDeadline, setTaskDeadline] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedDisabled, setSavedDisabled] = useState(true);
  const detailCommentAddRef = useRef(null);
  const taskDetailImg = useRef(null);
  const taskDetailImgSmall = useRef(null);
  const checkCompleteRef = useRef(null);
  const detailTitleRef = useRef(null);

  const detailDesRef = useRef(null);
  const detailYearlineRef = useRef(null);
  const detailMonthlineRef = useRef(null);
  const detailDatelineRef = useRef(null);
  const param = useParams();
  const id = param?.id;
  const location = useLocation();
  const navigate = useNavigate();

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
    setEditing(!editing);
    if (editing) {
      setUploading(true);
      const id = task._id;
      const taskName = detailTitleRef.current.value;

      const description = detailDesRef.current.value;
      const imageFiles = taskDetailImg.current.files;
      const filesSmall = taskDetailImgSmall.current.files;
      const year = detailYearlineRef.current.value;
      const month = detailMonthlineRef.current.value;
      const date = detailDatelineRef.current.value;
      const completed = checkCompleteRef.current.checked;
      console.log(checkCompleteRef.current.checked);
      console.log(filesSmall, imageFiles);
      const files = imageFiles?.length
        ? [...imageFiles]
        : filesSmall?.length
        ? [...filesSmall]
        : null;
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
      if (files?.length) {
        const file = files[0];
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=e6e425086757be46a714cf930fe529d6`,
          formData
        );
        image = res.data.data.display_url;
      }

      try {
        const { data } = await axios.put(
          "https://daily-task-server-fahimfaisalkhan.vercel.app/task-update",
          {
            id,
            taskName,
            description,
            image,
            deadline,
            completed,
          }
        );

        if (data.acknowledged) {
          imageFiles?.current?.reset();
          filesSmall?.current?.reset();
          setDroppedImage(null);
          refetch();

          setUploading(false);
          setEditing(false);
        }
      } catch (err) {
        console.log(err.message);

        setUploading(false);
        setEditing(false);
      }
    }
  };
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const { data } = await axios.delete(
        "https://daily-task-server-fahimfaisalkhan.vercel.app/task",
        {
          data: { id },
        }
      );
      console.log(data);
      if (data.acknowledged) {
        setDeleting(false);
        navigate("/", { replace: true });
        toast.success("Task deleted successfully");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Something went wrong try deleting again");
      setDeleting(false);
    }
  };
  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      await handleComment();
    }
  };

  const handleComment = async () => {
    const comment = detailCommentAddRef.current.value;
    console.log(comment);
    if (comment === "") {
      return;
    }

    const { data } = await axios.put(
      "https://daily-task-server-fahimfaisalkhan.vercel.app/add-comment",
      {
        id: task._id,
        comment: comment,
      }
    );

    if (data.acknowledged) {
      refetch();
      setSavedDisabled(true);
      detailCommentAddRef.current.value = "";
    }
  };
  const handleState = (event) => {
    console.log(detailCommentAddRef.current.focus());
    event.target.value === "" ||
    document.activeElement !== detailCommentAddRef.current
      ? setSavedDisabled(true)
      : setSavedDisabled(false);
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="my-24">
      <div className="max-w-7xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
        <div
          id="profile"
          className={`w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl ${
            darkMode ? "bg-primary" : "bg-white"
          } opacity-75 ml-4 lg:mx-0`}
        >
          <div className="p-4 md:p-12 text-center lg:text-left">
            {!editing ? (
              <div
                className="block lg:hidden rounded-sm shadow-xl mx-auto -mt-16 h-52 w-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${task?.image && task?.image})`,
                  backgroundPosition: "top",
                }}
              ></div>
            ) : (
              <div
                className="relative lg:hidden rounded-sm shadow-xl mx-auto -mt-16 h-52 w-48 bg-cover bg-center flex items-end  justify-center "
                style={{
                  backgroundImage: `url(${
                    droppedImage ? droppedImage : upload
                  })`,
                  backgroundPosition: "center",
                  backgroundSize: droppedImage ? 250 : 50,
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h1 className={`mb-12  ${droppedImage && "opacity-0"}`}>
                  <span className={`${darkMode ? "text-light" : "text-dark"}`}>
                    Browse or Drag image file
                  </span>
                  <input
                    ref={taskDetailImgSmall}
                    accept="image/png, image/gif, image/jpeg"
                    id="dropzoneFile"
                    name="dropzoneFile"
                    type="file"
                    onChange={(e) => {
                      const img = URL.createObjectURL(e.target.files[0]);
                      console.log(img);
                      setDroppedImage(URL.createObjectURL(e.target.files[0]));
                    }}
                    className="block h-52 w-48 absolute top-0  opacity-0 hover:cursor-pointer  max-w-[100%]"
                  />
                </h1>
                {droppedImage && (
                  <button
                    onClick={() => {
                      taskDetailImg.current.value = null;
                      setDroppedImage("");
                    }}
                    type="button"
                    className="w-8 h-8 text-white bg-secondary font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center justify-center mr-2 absolute -top-3 -right-5 z-20"
                  >
                    ✕<span className="sr-only">Icon description</span>
                  </button>
                )}
              </div>
            )}

            {!editing ? (
              <h1
                className={`text-3xl font-bold pt-8 lg:pt-0 ${
                  darkMode ? "text-light" : "text-dark"
                }`}
              >
                {task.taskName ? task.taskName : "No name assigned"}
              </h1>
            ) : (
              <input
                ref={detailTitleRef}
                type="text"
                placeholder="Task name"
                defaultValue={task.taskName && task.taskName}
                autoFocus
                className={`block w-full text-3xl text-primaryborder border-none rounded-sm 
             ${
               darkMode ? "bg-primary text-light" : "bg-white text-dark"
             } sm:text-xl focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
              />
            )}
            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
            <p
              className={`pt-4 ${
                darkMode ? "text-light" : "text-dark"
              } font-bold flex text-base items-center justify-center lg:justify-start`}
            >
              <span></span>
              <MdOutlineDateRange className="mr-2  lg:w-1/12" />
              <span className="font-normal mr-2 lg:w-5/12">
                Added on -{" "}
              </span>{" "}
              <span className="lg:w-6/12">{task.addedon}</span>
            </p>
            <p
              className={`pt-2 text-base ${
                darkMode ? "text-light" : "text-dark"
              }  font-bold flex items-center justify-center lg:justify-start `}
            >
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
                    className={`w-10/12 block font-normal  pl-2  lg:border-l-2 rounded-xs
             ${
               darkMode
                 ? "bg-primary text-light border-white"
                 : "bg-white text-dark border-primary"
             } text-base focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
                  />
                  <input
                    ref={detailMonthlineRef}
                    type="text"
                    placeholder="Month"
                    defaultValue={month}
                    style={{}}
                    className={`w-10/12 block font-normal  pl-2  lg:border-l-2 rounded-xs
             ${
               darkMode
                 ? "bg-primary text-light border-white"
                 : "bg-white text-dark border-primary"
             } text-base focus:outline-none focus:ring-transparent focus:border-transparent 
             `}
                  />
                  <input
                    ref={detailDatelineRef}
                    type="text"
                    placeholder="Date"
                    defaultValue={date}
                    style={{}}
                    className={`w-10/12 block font-normal pl-2   lg:border-l-2 rounded-xs
                    ${
                      darkMode
                        ? "bg-primary text-light border-white"
                        : "bg-white text-dark border-primary"
                    } text-base focus:outline-none focus:ring-transparent focus:border-transparent 
                    `}
                  />
                </span>
              )}
            </p>
            {!editing ? (
              <p
                className={`pt-2  font-bold flex text-base items-center justify-center lg:justify-start`}
              >
                {task?.completed ? (
                  <ImCheckboxChecked
                    className={`mr-2 w-1/12 ${
                      darkMode ? "text-light" : "text-dark"
                    }`}
                  />
                ) : (
                  <ImCheckboxUnchecked
                    className={`mr-2 w-1/12 ${
                      darkMode ? "text-light" : "text-dark"
                    }`}
                  />
                )}
                <span
                  className={`font-mediummr-2 w-5/12  ${
                    darkMode ? "text-light" : "text-dark"
                  }`}
                >
                  Completed
                </span>
              </p>
            ) : (
              <p className="pt-2 text-primary font-bold flex text-base items-center justify-center lg:justify-start">
                <input
                  ref={checkCompleteRef}
                  defaultChecked={task?.completed}
                  id="checkComplete"
                  type="checkbox"
                  className={`mr-2 w-1/12  ${
                    darkMode ? "accent-light" : "accent-dark"
                  } cursor-pointer`}
                />
                <label
                  htmlFor="checkComplete"
                  className={`font-mediummr-2 w-5/12 ${
                    darkMode ? "text-light" : "text-dark"
                  } `}
                >
                  Completed{" "}
                </label>{" "}
              </p>
            )}

            <p
              className={`pt-8 pl-2 text-sm ${
                darkMode ? "text-light" : "text-dark"
              }`}
            >
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
                  className="block p-2.5 w-full text-base text-primary rounded-lg border border-gray-300   "
                  placeholder="Write task description here..."
                ></textarea>
              )}
            </p>

            <div className="pt-12 pb-8 flex items-center justify-between gap-x-8">
              <button
                onClick={handleSubmit}
                className={`min-w-[7rem] bg-secondary  text-white font-bold py-2 px-4 rounded-full`}
              >
                {uploading ? (
                  <ClipLoader
                    color="#a69cac"
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    loading={true}
                    size={22}
                  />
                ) : editing ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
              <button
                onClick={() => handleDelete(task?._id)}
                className="p-2 bg-red-200 rounded-xl"
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
                  <RiDeleteBin6Line size={30} className="text-red-600 " />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-2/5">
          {!editing ? (
            <div>
              {task?.image ? (
                <img
                  src={task?.image}
                  id="pro-img"
                  className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
                  alt="Task "
                  style={{ height: "32rem", width: "29rem" }}
                />
              ) : (
                <div
                  className={`rounded-none lg:rounded-lg shadow-2xl hidden lg:flex justify-center items-center ${
                    darkMode ? "text-light" : "text-dark"
                  } `}
                  style={{ height: "32rem", width: "29rem" }}
                >
                  No Task Image Added
                </div>
              )}
            </div>
          ) : (
            <div className=" items-center justify-center w-full hidden lg:flex">
              <label
                htmlFor="dropzoneFile"
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
                  darkMode ? "transparent" : "bg-gray-50"
                } `}
                style={{ height: "32rem", width: "29rem" }}
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
                      taskDetailImg.current.value = null;
                      setDroppedImage("");
                    }}
                    type="button"
                    className="w-8 h-8 text-white bg-secondary font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center justify-center mr-2 absolute -top-3 -right-5 z-20"
                  >
                    ✕<span className="sr-only">Icon description</span>
                  </button>
                </div>

                <input
                  ref={taskDetailImg}
                  className="block w-full h-full absolute top-0  opacity-0  hover:cursor-pointer"
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
        <h2
          className={`text-2xl ${darkMode ? "text-light" : "text-dark"} px-1`}
        >
          {task.comment?.length ? "Comments" : "No Comments Added"}
        </h2>
        {task?.comment?.map((comment) => (
          <TaskDetailComments
            comment={comment?.comment}
            refetch={refetch}
            id={task._id}
          />
        ))}
      </div>
      <div className="container mx-auto my-6 flex flex-col">
        <label
          htmlFor="task-comment"
          className={`block mb-2 text-base font-medium ${
            darkMode ? "text-tertiary" : "text-dark"
          }`}
        >
          Add comment
        </label>
        <textarea
          ref={detailCommentAddRef}
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
          className={`py-2 px-4 rounded-md self-end mt-3 ${
            !darkMode ? "bg-primary  text-white" : "bg-tertiary text-dark"
          } disabled:opacity-70 disabled:text-gray-300`}
        >
          {" "}
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
