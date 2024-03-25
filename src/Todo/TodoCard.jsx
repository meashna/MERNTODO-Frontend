import React, { useState } from "react";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import "./TodoCard.css";
import axios from "axios";
import { toast } from "react-toastify";
import url from "../url.js";
import mixpanel from "../mixpanel.js";

const TodoCard = ({ title, id, delid, update }) => {
  const usermail = localStorage.getItem("usermail");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (editTitle.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }
    try {
      await axios.put(`${url}api/v2/updateTask/${id}`, {
        title: editTitle,
      });
      update(id, editTitle);
      EventTaskedit(usermail);
      setIsEditing(false);
      toast.success("Task Updated");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  const EventTaskedit = (usermail) => {
    mixpanel.track("Task Edited", {
      "User ID": usermail,
      "Task ID": id,
      "Old Title": title,
      "New Title": editTitle,
    });
    console.log("Task edit event tracked successfully");
  };

  return (
    <div className="task-cont">
      {isEditing ? (
        <input
          className="todo-input"
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
      ) : (
        <div className="tasks">{title}</div>
      )}
      <div className="task-icons">
        {isEditing ? (
          <ImCheckmark className="icons" onClick={handleUpdate} />
        ) : (
          <>
            <MdDelete className="icons" onClick={() => delid(id)} />
            <MdModeEditOutline className="icons" onClick={handleEdit} />
          </>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
