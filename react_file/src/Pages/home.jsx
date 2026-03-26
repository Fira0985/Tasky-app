import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter
} from "react-icons/fa";
import {
  UserPlus,
  PlusCircle,
  Layers,
  Users,
  ArrowRight,
  Download,
  Zap,
  Shield,
  Layout,
  Calendar as CalendarIcon
} from "lucide-react";
import image from "../asset/69KTbX-LogoMakr.png";
import heroMockup from "../asset/tasky_hero_mockup.png";
import LoginPop from "../component/loginPop";
import SignUp from "../component/signUp";
import SupportModal from "../component/SupportModal";
import "../styles/home.css";

function Home({ GetUserEmail }) {
  const navigate = useNavigate();

  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  function GetLoginData(data) {
    const isSuccess = data?.message === "User logged in successfully" ||
      data?.message === "User loged in successfully";
    if (isSuccess) {
      navigate("/user");
    }
  }

  // Removed legacy localStorage check since App.js handles it

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
    setShowSupport(false);
  }

  return (
    <div className="home animate-fade-in">
      {/* Overlay & centered modal(s) */}
      {(isRegisterOpen || isLoginOpen || showSupport) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}>×</button>
            {isRegisterOpen && <SignUp onClose={closeModal} />}
            {isLoginOpen && (
              <LoginPop
                SendDataToParent={GetLoginData}
                getEmail={GetUserEmail}
                GetMessage={() => { }}
                onClose={closeModal}
              />
            )}
            {showSupport && <SupportModal onClose={closeModal} />}
          </div>
        </div>
      )}

      {/* Navbar */}
      <header>
        <nav className="navbar">
          <a id="logo" href="/"><img src={image} alt="Tasky Logo" /></a>
          <div className="nav-links">
            <button className="nav-link-btn" onClick={() => document.getElementById('howItWorks').scrollIntoView({ behavior: 'smooth' })}>How It Works</button>
            <button className="nav-link-btn" onClick={() => setShowSupport(true)}>Support</button>
            <button className="nav-link-btn" onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })}>Download</button>
            <button className="nav-btn nav-btn--login" onClick={openLogin}>Login</button>
            <button className="nav-btn nav-btn--signup" onClick={openRegister}>Get Started</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="overview">
        <div className="hero-container">
          <div className="hero-content">
            <div className="badge-glow animate-slide-up">
              <span className="badge">v1.2 is here – Faster tasks than ever</span>
            </div>
            <h1 className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              Your Personal <span>Productivity</span> Sanctuary
            </h1>
            <p className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              The premium individual workspace designed to help you conquer your goals. 
              Organize projects, track deadlines with our interactive calendar, and personalize your experience.
            </p>
            <div className="hero-actions animate-slide-up" style={{ animationDelay: '300ms' }}>
              <button className="primary-btn" onClick={openRegister}>
                Start Your Journey <ArrowRight size={18} />
              </button>
              <button className="secondary-btn" onClick={() => document.getElementById('howItWorks').scrollIntoView({ behavior: 'smooth' })}>
                View Demo
              </button>
            </div>
          </div>
          <div className="hero-visual animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="mockup-container">
              <img src={heroMockup} alt="Tasky Dashboard Mockup" className="hero-mockup" />
              <div className="hero-circle-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="howItWorks">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four simple steps to mastery</p>
        </div>
        <div className="steps">
          {[
            {
              icon: <UserPlus />,
              title: "Personal Setup",
              desc: "Create your workspace and personalize your profile with a custom avatar for a unique experience."
            },
            {
              icon: <PlusCircle />,
              title: "Smart Tasks",
              desc: "Quickly define tasks, set priorities, and assign deadlines to keep your day structured."
            },
            {
              icon: <Layout />,
              title: "Project Focus",
              desc: "Group related tasks into dedicated projects to maintain a clean and organized workspace."
            },
            {
              icon: <CalendarIcon />,
              title: "Visual Timeline",
              desc: "Navigate your schedule with our fully interactive calendar and never miss a deadline again."
            }
          ].map((step, i) => (
            <div key={i} className="step animate-slide-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid (New Section) */}
      <section className="features">
        <div className="feature-card">
          <Zap className="feature-icon" />
          <h3>Fast & Fluid</h3>
          <p>Experience zero latency with our optimized cloud backend.</p>
        </div>
        <div className="feature-card">
          <Shield className="feature-icon" />
          <h3>Secure by Design</h3>
          <p>Your data is encrypted with military-grade security standards.</p>
        </div>
        <div className="feature-card">
          <Layout className="feature-icon" />
          <h3>Clean Interface</h3>
          <p>Distraction-free design focused on getting things done.</p>
        </div>
      </section>

      {/* Download Section */}
      <section className="download" id="download">
        <div className="download-content">
          <h2>Ready to get productive?</h2>
          <p>Download Tasky App for your desktop and sync your data across all your devices instantly.</p>
          <div className="download-buttons">
            <button className="btn-download" onClick={() => alert('Windows download coming soon!')}>
              <Download size={20} /> Download for Windows
            </button>
            <button className="btn-download" onClick={() => alert('Linux download coming soon!')}>
              <Download size={20} /> Download for Linux
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-company">
            <img src={image} alt="Tasky" className="footer-logo" />
            <p>Your ultimate partner in productivity and task management.</p>
            <div className="social-icons">
              <a href="#"><FaFacebook size={20} /></a>
              <a href="#"><FaTwitter size={20} /></a>
              <a href="#"><FaInstagram size={20} /></a>
              <a href="#"><FaLinkedin size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Product</h4>
            <ul>
              <li><button onClick={() => document.getElementById('howItWorks').scrollIntoView({ behavior: 'smooth' })}>Features</button></li>
              <li><button onClick={() => alert('Pricing coming soon!')}>Pricing</button></li>
              <li><button onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })}>Mobile App</button></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><button onClick={() => setShowSupport(true)}>Help Center</button></li>
              <li><button onClick={() => setShowSupport(true)}>Contact Us</button></li>
              <li><button onClick={() => alert('Privacy policy coming soon!')}>Privacy Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Tasky Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
