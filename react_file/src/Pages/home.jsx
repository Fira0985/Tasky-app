import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import image from "../asset/69KTbX-LogoMakr.png";
import LoginPop from "../component/loginPop";
import SignUp from "../component/signUp";
import "../styles/home.css";

function Home({ GetUserEmail }) {
  const navigate = useNavigate();

  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  function GetLoginData(data) {
    if (data?.message === "User loged in successfully") {
      navigate("/user");
    }
  }

  function openRegister() {
    setRegisterOpen(true);
    setLoginOpen(false);
  }

  function openLogin() {
    setLoginOpen(true);
    setRegisterOpen(false);
  }

  function closeModal() {
    setRegisterOpen(false);
    setLoginOpen(false);
  }

  return (
    <div className="home">
      {/* Overlay & centered modal(s) - renders only when a modal is open */}
      {(isRegisterOpen || isLoginOpen) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            {isRegisterOpen && <SignUp onClose={closeModal} />}
            {isLoginOpen && (
              <LoginPop
                SendDataToParent={GetLoginData}
                getEmail={GetUserEmail}
                GetMessage={() => {}}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}

      {/* Navbar */}
      <header>
        <div className="navbar">
          <a id="logo"><img src={image} alt="Company-logo" /></a>
          <div className="nav-links">
            <a href="#howItWorks">How It Works</a>
            <a href="#">Support Us</a>
            <a href="#download">Download App</a>
            <button className="nav-btn nav-btn--login" onClick={openLogin}>Login</button>
            <button className="nav-btn nav-btn--signup" onClick={openRegister}>Sign Up</button>
          </div>
        </div>
      </header>

      {/* Overview Section */}
      <section className="overview">
        <h1>Tasky App: Simplify Your Task Management</h1>
        <p>
          Tasky App is designed to help you efficiently manage tasks, collaborate with teams, and stay productive.
          Whether you're working on a personal project or managing a large team, Tasky App is here to simplify your task management experience.
        </p>
        <button>Get Started</button>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="howItWorks">
        <h2>How It Works</h2>
        <div className="steps">
          {[
            { title: "Step 1: Create an Account", desc: "Sign up to get access to all the features Tasky App has to offer. Manage your tasks and collaborate with your team easily." },
            { title: "Step 2: Create a Task", desc: "Create a task by setting its name, detail of the task, deadline, priority and dependency." },
            { title: "Step 3: Organize Tasks", desc: "Group your tasks into projects, set deadlines, and track progress. Tasky App provides you with a clear overview of your workflow." },
            { title: "Step 4: Collaborate and Succeed", desc: "Invite your team members, assign tasks, and track completion to achieve goals faster." }
          ].map((step, i) => (
            <div key={i} className="step">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section className="download" id="download">
        <h2>Download the Tasky App</h2>
        <p>Get Tasky App on your PC and manage your tasks on the go. Available on both Windows and Linux platforms.</p>
        <div className="download-buttons">
          <a href="#" className="btn-download">Download for Windows</a>
          <a href="#" className="btn-download">Download for Linux</a>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer">
          <div className="footer-container">
            <div className="footer-logo">
              <a href="#"><img src={image} alt="Tasky App Logo" /></a>
              <p>Tasky App: Your Personal Task Manager</p>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#howItWorks">How It Works</a></li>
                <li><a href="#">Support Us</a></li>
                <li><a href="#download">Download</a></li>
              </ul>
            </div>

            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook size={28} /></a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter size={28} /></a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={28} /></a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin size={28} /></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            &copy; 2024 Tasky App. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
