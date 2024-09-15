import React from "react";
import { Route, Routes } from 'react-router-dom';
import CreateBlog from "./components/CreateBlog";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route exact path='/' element={<CreateBlog/>} />
      </Routes>
    </div>
  );
}

export default App;
