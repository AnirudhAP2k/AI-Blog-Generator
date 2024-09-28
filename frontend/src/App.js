import React from "react";
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import CreateBlog from "./components/CreateBlog";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<CreateBlog />} />
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
