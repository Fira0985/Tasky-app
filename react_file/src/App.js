import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/home';
import User from './Pages/UserPage';
import ProfilePage from './Pages/ProfilePage';

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("email") || "";
  });

  function GetUserEmail(name) {
    setUserEmail(name);
    localStorage.setItem("email", name);
  }

  return (
    <Routes>
      <Route path="/" element={<Home GetUserEmail={GetUserEmail} />} />
      <Route path="/user" element={<User email={userEmail} />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
