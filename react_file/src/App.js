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
      <Route path="/"
        element={
          <div className='container'>
            <div id="overlay" style={overlayStyle}></div>
            <header>
              <div className="navbar">
                <a id="logo"><img src={image} alt="Company-logo" /></a>
                <div className="nav-links">
                  <a href="#howItWorks">How It Works</a>
                  <a href="#">Support Us</a>
                  <a href="#download">Download App</a>
                  <a href="#overview" id="login" onClick={LoginForm}>Login</a>
                  <a href="#overview" id="signup" onClick={RegisterForm}>Sign Up</a>
                </div>
              </div>
            </header>

            <main className='main'>
              <Home />
              <button className="close" style={closeStyle} onClick={close}>X</button>
              <Pop style={registerStyle} GetMessage={message} />
              <p class="account-link" id='loginLink'>
                <a className={`login-link ${status ? 'normal' : 'error'}`} href="#" style={registerStyle} onClick={LoginForm}>Already have an account</a></p>
              <LoginPop style={loginStyle} SendDataToParent={GetLoginData} GetMessage={message} getEmail={GetUserEmail} />
              <p class="account-link" id='registerLink'>
                <a className={`register-link ${status ? 'normal' : 'error'}`} href="#" style={loginStyle} onClick={RegisterForm}>Don't have an account? Register here</a></p>
            </main>
          </div>
        } />
      <Route path="/user" element={<User email={userEmail} />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
