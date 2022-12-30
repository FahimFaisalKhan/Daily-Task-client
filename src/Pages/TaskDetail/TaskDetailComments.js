import { async } from "@firebase/util";
import axios from "axios";
import React, { useRef, useState } from "react";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
const TaskDetailComments = ({ comment, refetch, id }) => {
  const [commentEditing, setCommentEditing] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const detailCommentRef = useRef(null);
  const handleEnter = async (event) => {
    // console.log(
    //   detailCommentRef?.current?.value,
    //   commentLoading,
    //   event?.key === "Enter" || commentLoading
    // );
    if (event?.key === "Enter") {
      await handleComment();

      event.target.value = "";
    }
  };

  const handleComment = async () => {
    const updatedComment = detailCommentRef?.current?.value;

    const { data } = await axios.put(
      "https://daily-task-server-fahimfaisalkhan.vercel.app/update-comment",
      {
        id: id,
        commentToUpdate: comment,
        updatedComment: updatedComment,
      }
    );

    if (data.acknowledged) {
      refetch();
      setCommentEditing(false);
      setCommentLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const { data } = await axios.delete(
        "https://daily-task-server-fahimfaisalkhan.vercel.app/delete-comment",
        {
          data: { id, commentToDelete: comment },
        }
      );
      console.log(data);
      if (data.acknowledged) {
        setDeleting(false);
        refetch();
      }
    } catch (err) {
      console.log(err.message);

      setDeleting(false);
    }
  };
  if (commentEditing) {
    return (
      <div className="flex flex-col">
        <textarea
          onKeyDown={handleEnter}
          // defaultValue={task.description && task.description}
          ref={detailCommentRef}
          name="commentEdit"
          rows="4"
          className={`block p-2 w-full text-base text-primary rounded-lg border border-gray-300   `}
          placeholder="Write task description here..."
        ></textarea>
        <button
          onClick={handleComment}
          className="py-2 px-4 rounded-md self-end mt-3 bg-primary w-1/12 text-white "
        >
          {commentLoading ? (
            <ClipLoader
              color="#a69cac"
              aria-label="Loading Spinner"
              data-testid="loader"
              loading={true}
              size={22}
            />
          ) : (
            "Save"
          )}
        </button>
      </div>
    );
  }
  return (
    <div
      className={`  p-6 bg-light border border-light rounded-lg shadow-md flex  items-center justify-between  `}
    >
      <p className="font-normal text-primary">{comment}</p>
      <div className="flex items-center justify-end gap-x-5">
        {" "}
        <RiEdit2Line
          size={30}
          className="cursor-pointer"
          onClick={() => setCommentEditing(true)}
        />
        {deleting ? (
          <ClipLoader
            color="#a69cac"
            aria-label="Loading Spinner"
            data-testid="loader"
            loading={true}
            size={22}
          />
        ) : (
          <RiDeleteBin6Line
            onClick={() => handleDelete(id)}
            size={30}
            className="text-red-600 cursor-pointer"
          />
        )}{" "}
      </div>
    </div>
  );
};

export default TaskDetailComments;
