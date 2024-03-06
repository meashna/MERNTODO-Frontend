import React, { useState, useEffect } from "react";
import "./Todo.css";
import { useNavigate } from "react-router-dom";
import TodoCard from "./TodoCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoAdd } from "react-icons/io5";
import url from "../url.js";

const Todo = () => {
  const userId = sessionStorage.getItem("id");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState({ title: "" });
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${url}api/v2/getTasks/${userId}`);
        // setTasks(response.data.list);
        setTasks(response.data.list || []);
      } catch (error) {
        toast.error("Failed to fetch tasks");
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskInput({ ...taskInput, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskInput.title.trim() === "") {
      toast.error("Enter Task");
      return;
    }
    try {
      const response = await axios.post(`${url}api/v2/addTask`, {
        title: taskInput.title,
        id: userId,
      });
      setTasks([...tasks, response.data.list]);
      setTaskInput({ title: "" });
      toast.success("Task Added");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${url}api/v2/deleteTask/${taskId}`, {
        data: { id: userId },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task Deleted");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleUpdate = (taskId, newTitle) => {
    const updatedTasks = tasks.map((task) =>
      taskId === task._id ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);
  };

  // Logout function
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="todo">
      <nav>
        <div className="wel-h">{username}</div>
        <button className="btnlogout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="todo-heading">My To-Do List</div>

      <div className="todo-container">
        <ToastContainer />
        <div className="todo-form">
          <form onSubmit={handleSubmit} style={{ display: "flex" }}>
            <input
              className="addtodoinput"
              type="text"
              placeholder="Enter task"
              name="title"
              onChange={handleChange}
              value={taskInput.title}
            />
            <button className="add" type="submit">
              <div className="add-icon">
                <IoAdd />
              </div>
            </button>
          </form>
        </div>
        <div className="todo-body">
          {tasks.map((item, index) => (
            <TodoCard
              // key={item._id}
              key={index}
              title={item.title}
              id={item._id}
              delid={handleDelete}
              update={handleUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
