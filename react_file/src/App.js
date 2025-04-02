import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import image from './asset/69KTbX-LogoMakr.png';
import Home from './component/home';
import LoginPop from './component/loginPop';
import Pop from './component/pop';
import User from './component/UserPage';

function App() {
  const navigate = useNavigate();

  const [registerStyle, setRegisterStyle] = useState({ display: "none" })
  const [loginStyle, setLoginStyle] = useState({ display: "none" })
  const [overlayStyle, setOverlayStyle] = useState({ display: "none" })
  const [closeStyle, setCloseStyle] = useState({ display: "none" })
  const [status, setStatus] = useState()  // used to store the response from login request
  const [userEmail, setUserEmail] = useState(() => {
    return (localStorage.getItem("email")) || ""
  })

  async function GetUserEmail(name) {
    setUserEmail(name)
    localStorage.setItem("email", name)
  }

  function GetLoginData(data) {
    console.log(data.message)
    if (data.message == "User loged in successfully") {
      console.log(data.message)
      navigate("/user")
    }
  }

  function message(data) {
    setStatus(data)
  }

  // To display the regsiter form
  function RegisterForm() {
    setRegisterStyle({ display: "block" })
    setLoginStyle({ display: "none" })
    setOverlayStyle({ display: "block" })
    setCloseStyle({ display: "block" })
  }

  // To display the Login form
  function LoginForm() {
    setLoginStyle({ display: "block" })
    setRegisterStyle({ display: "none" })
    setOverlayStyle({ display: "block" })
    setCloseStyle({ display: "block" })
  }

  // To close when the exit button is clicked
  function close() {
    setRegisterStyle({ display: "none" })
    setOverlayStyle({ display: "none" })
    setCloseStyle({ display: "none" })
    setLoginStyle({ display: "none" })
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
              <Pop style={registerStyle} />
              <p class="account-link" id='loginLink'>
                <a className={`login-link ${status ? 'normal' : 'error'}`} href="#" style={registerStyle} onClick={LoginForm}>Already have an account</a></p>
              <LoginPop style={loginStyle} SendDataToParent={GetLoginData} GetMessage={message} getEmail={GetUserEmail} />
              <p class="account-link" id='registerLink'>
                <a className={`register-link ${status ? 'normal' : 'error'}`} href="#" style={loginStyle} onClick={RegisterForm}>Don't have an account? Register here</a></p>
            </main>
          </div>
        } />
      <Route path="/user" element={<User email={userEmail} />} />
    </Routes>

  );
}

export default App;