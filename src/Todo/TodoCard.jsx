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
  const [oldTitle, setOldTitle] = useState(title);
  const [inputerror, setInputerror] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setOldTitle(title);
  };

  const handleUpdate = async () => {
    if (editTitle.trim() === "") {
      //toast.error("Task cannot be empty");
      setInputerror("Task cannot be empty");
      return;
    } else {
      setInputerror("");
    }
    try {
      await axios.put(`${url}api/v2/updateTask/${id}`, {
        title: editTitle,
      });
      update(id, editTitle);
      Taskedited(usermail, oldTitle, editTitle);
      setIsEditing(false);
      setOldTitle(editTitle);
      toast.success("Task Updated");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  const Taskedited = (usermail, oldTitle, newTitle) => {
    mixpanel.track("Task Edited", {
      "User ID": usermail,
      "Task ID": id,
      "Old Title": oldTitle,
      "New Title": newTitle,
    });
    mixpanel.people.increment("Tasks Edited", 1);
    console.log(usermail, oldTitle, newTitle);
    console.log("Task edit event tracked successfully");
  };

  return (
    <div className="task-cont">
      {isEditing ? (
        <input
          //className="todo-input"
          className={inputerror ? "error-placeholder" : "todo-input"}
          placeholder={inputerror ? "Task cannot be empty!!" : ""}
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
