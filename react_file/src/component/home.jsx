import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import image from '../asset/69KTbX-LogoMakr.png';
import '../styles/home.css';

function Home(){
    return(
    <div className="home">
    {/* <!-- Overview Section --> */}
    <div className="overview">
        <h1>Tasky App: Simplify Your Task Management</h1>
        <p>Tasky App is designed to help you efficiently manage tasks,
            collaborate with teams, and stay productive. Whether you're
            working on a personal project or managing a large team, Tasky
            App is here to simplify your task management experience.</p>
        <button>Get Started</button>
    </div>

    {/* <!-- How It Works Section --> */}
    <div className="how-it-works" id="howItWorks">
        <h2>How It Works</h2>
        <div className="steps">
            <div className="step">
                <h3>Step 1: Create an Account</h3>
                <p>Sign up to get access to all the features Tasky App has
                    to offer. Manage your tasks and collaborate with your team easily.</p>
            </div>
            <div className="step">
                <h3>Step 2: Create a Task</h3>
                <p>Create a task by setting it's name, detail of the task,deadline,priority and dependency</p>
            </div>
            <div className="step">
                <h3>Step 3: Organize Tasks</h3>
                <p>Group your tasks into projects, set deadlines, and track progress.
                    Tasky App provides you with a clear overview of your workflow.</p>
            </div>
            <div className="step">
                <h3>Step 4: Collaborate and Succeed</h3>
                <p>Invite your team members, assign tasks, and track completion to achieve goals faster.</p>
            </div>
        </div>
    </div>

    {/* <!-- Download Section --> */}
    <div className="download" id="download">
        <h2>Download the Tasky App</h2>
        <p>Get Tasky App on your PC and manage your tasks on the go.
            Available on both Window and Mac OS platforms.</p>
        <div className="download-buttons">
            <a href="#" className="btn-download android">Download for Window</a>
            <a href="#" className="btn-download ios">Download for Linux</a>
        </div>
    </div>

    <div className="footer-section">
    <footer className="footer" >
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
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={30} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={30} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={30} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} />
            </a>
            </div>
        </div>
    </div>

    <div className="footer-bottom">
        <p>&copy; 2024 Tasky App. All Rights Reserved.</p>
    </div>
</footer>
    </div>

    </div>
    )
}

export default Home