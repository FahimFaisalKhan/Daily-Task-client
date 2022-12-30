import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import Spinner from "../../Shared/Spinner/Spinner";
import TaskCard from "../MyTasks/TaskCard/TaskCard";
import CompletedTaskCard from "./CompletedTaskCard/CompletedTaskCard";
import { useMode } from "../../hooks/useMode";

const CompletedTasks = () => {
  const { darkMode } = useSelector(selectUser);
  useMode(darkMode);
  const {
    isLoading,
    refetch,
    data: tasks,
  } = useQuery({
    queryKey: ["task-completed"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://daily-task-server-fahimfaisalkhan.vercel.app/tasks-completed"
      );
      console.log(data);
      return data;
    },
  });

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
  const handleNotCompleted = async (id) => {
    const { data } = await axios.put(
      "https://daily-task-server-fahimfaisalkhan.vercel.app/task-not-completed",
      {
        id,
      }
    );

    if (data.modifiedCount > 0) {
      refetch();
    }
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto my-20">
      <h2 className="text-2xl text-dark px-1">Completed Tasks</h2>
      {tasks.map((t, i) => (
        <CompletedTaskCard
          key={i}
          task={t}
          index={i + 1}
          handleDelete={handleDelete}
          handleNotCompleted={handleNotCompleted}
          refetch={refetch}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default CompletedTasks;
