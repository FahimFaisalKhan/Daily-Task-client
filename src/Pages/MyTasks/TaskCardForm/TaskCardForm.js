import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { SlCalender } from "react-icons/sl";
import { MdAttachFile } from "react-icons/md";
import "./TaskCardForm.css";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const TaskCardForm = ({
  clickedOutside,
  setQuickAddHidden,
  refetch,
  setClickedOutside,
}) => {
  const fileRef = useRef(null);
  const desRef = useRef(null);
  const titleRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState();
  const [moddalHidden, setModalHidden] = useState(true);
  const [currentlyAddingId, setCurrentlyAddingId] = useState(null);
  const [addingTask, setAdding] = useState(false);
  const today = new Date();
  const handleTitle = async (event) => {
    if (event.key === "Enter") {
      const title = event.target.value;

      if (title) {
        setAdding(true);
        try {
          const { data } = await axios.post(
            "https://daily-task-server-fahimfaisalkhan.vercel.app/tasks",
            {
              taskName: title,
            }
          );

          if (data.acknowledged) {
            setCurrentlyAddingId(data.insertedId);
            setQuickAddHidden(true);
            refetch();
            setAdding(false);
          }
        } catch (err) {
          console.log(err.message);
          setAdding(false);
        }
      }
    }
  };
  useEffect(() => {
    console.log(clickedOutside);
    if (clickedOutside) {
      setAdding(true);
      const deadline = new Date(selectedDay);
      const files = fileRef.current.files;

      if (files.length) {
        const formData = new FormData();
        formData.append("image", files[0]);
        axios
          .post(
            `https://api.imgbb.com/1/upload?key=e6e425086757be46a714cf930fe529d6`,
            formData
          )
          .then((res) => {
            console.log(res);
            const image = res.data.data.display_url;
            axios
              .put(
                "https://daily-task-server-fahimfaisalkhan.vercel.app/tasks",
                {
                  taskName: titleRef.current.value,
                  description: desRef.current.value,
                  image: image,
                  deadline: deadline,
                  id: currentlyAddingId,
                }
              )
              .then(({ data }) => {
                console.log(data);
                setQuickAddHidden(true);
                setClickedOutside(false);
                refetch();
                setAdding(false);
              })
              .catch((err) => {
                console.log(err.message);

                setAdding(false);
              });
          })
          .catch((err) => {
            console.log(err.message);
            setAdding(false);
          });
      } else {
        axios
          .put("https://daily-task-server-fahimfaisalkhan.vercel.app/tasks", {
            taskName: titleRef.current.value,
            description: desRef.current.value,

            deadline: deadline,
            id: currentlyAddingId,
          })
          .then(({ data }) => {
            console.log(data);
            setQuickAddHidden(true);
            setClickedOutside(false);
            refetch();
            setAdding(false);
          })
          .catch((err) => {
            console.log(err.message);
            setAdding(false);
          });
      }
    }
  }, [
    clickedOutside,
    setClickedOutside,
    currentlyAddingId,
    selectedDay,
    setQuickAddHidden,
    refetch,
  ]);
  return (
    <div className="mt-12 mb-16">
      <div
        className={`w-full bg-white  flex ${
          addingTask && "justify-center "
        }  items-center rounded-lg  border-4 border-tertiary min-h-[12rem]`}
      >
        {addingTask && (
          <ClipLoader
            className=" w-full"
            color="#a69cac"
            aria-label="Loading Spinner"
            data-testid="loader"
            loading={true}
            size={50}
          />
        )}

        <div className={`${addingTask && "opacity-0 w-0"} `}>
          <input
            ref={titleRef}
            onKeyDown={handleTitle}
            type="text"
            placeholder="Title"
            autoFocus
            class={`block w-full p-3 text-gray-900 border border-none rounded-lg 
             bg-white sm:text-xl focus:outline-none focus:ring-transparent focus:border-transparent 
             ${addingTask && "hidden"} `}
          />
          <input
            ref={desRef}
            type="text"
            placeholder="Description"
            class="block w-full px-3 py-2  text-gray-900 border border-none rounded-lg
             bg-white sm:text-base focus:outline-none focus:ring-transparent focus:border-transparent 
             "
          />
          <div className="flex">
            <div
              className="flex mx-3 my-2 cursor-pointer "
              onClick={() => setModalHidden(false)}
            >
              <SlCalender />
            </div>
            <div className=" px-3 py-2 ">
              <div className="relative  ">
                <MdAttachFile
                  size={17}
                  className="absolute top-0 left-0 cursor-pointer  z-50"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  className="w-3 h-4 absolute top-0 left-0 opacity-0   cursor-pointer z-30"
                />
              </div>
            </div>
          </div>

          <div
            className={`transition fixed top-0 left-0 w-[100vw] h-[100vh]  z-30 ${
              moddalHidden && "hidden"
            }`}
          >
            <div
              className="absolute top-[50%] left-[50%] center bg-light p-12 rounded-lg text-primary 
               "
            >
              <div className="flex flex-col">
                <DayPicker
                  mode="single"
                  selected={selectedDay}
                  onSelect={setSelectedDay}
                  disabled={{ before: today }}
                ></DayPicker>
                <button
                  disabled={!selectedDay}
                  onClick={() => setModalHidden(true)}
                  type="button"
                  className={`${
                    selectedDay
                      ? " text-white bg-primary hover:bg-secondary"
                      : " text-gray-500 bg-tertiary"
                  } font-medium rounded-lg text-sm px-5 py-2.5  mb-2`}
                >
                  Confirm
                </button>
              </div>

              <button
                onClick={() => setModalHidden(true)}
                type="button"
                class="w-8 h-8 text-white bg-primary font-medium rounded-full text-sm p-5 text-center inline-flex items-center justify-center mr-2 absolute -top-4 right-7 sm:right-1 lg:-top-3 lg:-right-5 z-20"
              >
                ✕<span class="sr-only">Icon description</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardForm;
