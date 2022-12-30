import axios from "axios";
import React, { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ClipLoader from "react-spinners/ClipLoader";
import { useMode } from "../../hooks/useMode";
import { selectUser } from "../../redux/authSlice";
const AddTasks = () => {
  const { darkMode } = useSelector(selectUser);
  useMode(darkMode);
  const [adding, setAdding] = useState(false);
  const [droppedImage, setDroppedImage] = useState("");
  const [selectedDay, setSelectedDay] = useState();
  const navigate = useNavigate();
  const today = new Date();
  const taskImg = useRef(null);
  const handleAddTask = async (event) => {
    setAdding(true);
    event.preventDefault();
    const form = event.target;
    const taskName = form.name.value;

    const description = form.description.value;
    try {
      let image;
      const file = form.dropzoneFile.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=e6e425086757be46a714cf930fe529d6`,
          formData
        );
        image = res.data.data.display_url;
      }
      let deadline;
      if (selectedDay) {
        deadline = new Date(selectedDay);
      }
      console.log(deadline);
      const res = await axios.post("http://localhost:5000/tasks", {
        taskName,
        description,
        image,
        deadline,
      });

      if (res.data.acknowledged) {
        toast.success(`Task named ${taskName} added`);
        setAdding(false);
        navigate("/media", { replace: true });
      }
    } catch (err) {
      console.log(err.message);
      setAdding(false);
    }

    // const  file = form.
  };
  return (
    <div className="container mx-auto my-20">
      <h2 className="text-2xl text-dark px-1">Add Task</h2>
      <form onSubmit={handleAddTask} className="my-8">
        <div className="mb-6">
          <label
            htmlFor="name"
            className={`block mb-2  font-medium ${
              darkMode ? "text-light" : "text-gray-900 "
            } text-base`}
          >
            Task Name
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
            htmlFor="message"
            className={`block mb-2  font-medium ${
              darkMode ? "text-light" : "text-gray-900 "
            } text-base`}
          >
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            className="block p-2.5 w-full text-base text-gray-900  rounded-lg border border-gray-300   "
            placeholder="Write task description here..."
          ></textarea>
        </div>
        <div className="mb-6">
          <label
            className={`block mb-2  font-medium ${
              darkMode ? "text-light" : "text-gray-900 "
            } text-base`}
          >
            Add a Deadline
          </label>
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              disabled={{ before: today }}
              className={`${
                darkMode ? "bg-primary  text-light " : "bg-light"
              } p-12 rounded-xl`}
            ></DayPicker>
          </div>
        </div>
        <div className="mt-14 mb-12">
          <label
            className={`block mb-2  font-medium ${
              darkMode ? "text-light" : "text-gray-900 "
            } text-base`}
          >
            Add Task Image
          </label>
          <div className="flex items-center justify-center w-full ">
            <label
              htmlFor="dropzoneFile"
              className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
                !darkMode ? "bg-gray-50" : ""
              } `}
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
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
                    taskImg.current.value = null;
                    setDroppedImage("");
                  }}
                  type="button"
                  className="w-8 h-8 text-white bg-secondary font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center justify-center mr-2 absolute -top-3 -right-5 z-20"
                >
                  ✕<span className="sr-only">Icon description</span>
                </button>
              </div>

              <input
                ref={taskImg}
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
        </div>

        <button
          type="submit"
          className="text-white bg-secondary  focus:ring-4 focus:outline-none  font-medium rounded-lg text-base w-full  px-5 py-2.5 text-center"
          disabled={adding}
        >
          {adding ? (
            <ClipLoader
              color="#a69cac"
              aria-label="Loading Spinner"
              data-testid="loader"
              loading={true}
              size={25}
            />
          ) : (
            "Add"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTasks;
