import React from "react";
import Register from "./Register/Register";
import Login from "./Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./Todo/Todo";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/todo" element={<Todo />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
