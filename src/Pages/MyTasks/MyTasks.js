import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setDataLoading } from "../../redux/authSlice";
import Spinner from "../../Shared/Spinner/Spinner";

import TaskCard from "./TaskCard/TaskCard";
import { AiOutlinePlus } from "react-icons/ai";
import TaskCardForm from "./TaskCardForm/TaskCardForm";
import { useQuery } from "@tanstack/react-query";
import { useMode } from "../../hooks/useMode";
const MyTasks = () => {
  const { dataLoading, darkMode } = useSelector(selectUser);
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [quickAddHidden, setQuickAddHidden] = useState(true);
  const [clickedOutside, setClickedOutside] = useState(false);
  useMode(darkMode);
  const dispatch = useDispatch();

  const quickAddRef = useRef(null);

  const {
    data: tasks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://daily-task-server-fahimfaisalkhan.vercel.app/tasks"
      );
      console.log(data);

      dispatch(setDataLoading({ dataLoading: false }));
      return data;
    },
  });

  function handleClickOutside(event) {
    if (quickAddRef.current && !quickAddRef.current.contains(event.target)) {
      setClickedOutside(true);
    }
  }
  useEffect(() => {
    if (!quickAddHidden) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [quickAddHidden]);

  if (dataLoading || isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto my-20 min-h-[100vh] ">
      <h2 className="text-2xl text-dark mb-5">My Tasks </h2>

      <button
        onClick={() => {
          setQuickAddHidden(false);
        }}
        type="button"
        className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
      >
        <AiOutlinePlus className="text-light mr-2" /> Quick Add
      </button>
      <div ref={quickAddRef}>
        {!quickAddHidden && (
          <TaskCardForm
            clickedOutside={clickedOutside}
            setQuickAddHidden={setQuickAddHidden}
            setClickedOutside={setClickedOutside}
            refetch={refetch}
          />
        )}
      </div>

      {tasks?.map((t, i) => (
        <TaskCard
          key={i}
          index={i + 1}
          task={t}
          refetch={refetch}
          taskDeadline={taskDeadline}
        />
      ))}
    </div>
  );
};

export default MyTasks;
