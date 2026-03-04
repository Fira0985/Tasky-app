import React, { useState, Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Lazy load components for better performance
const Home = lazy(() => import('./Pages/home'));
const User = lazy(() => import('./Pages/UserPage'));
const ProfilePage = lazy(() => import('./component/ProfilePage'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.1rem',
    color: 'var(--primary-600)'
  }}>
    Loading...
  </div>
);

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("email") || "";
  });

  const handleUserEmail = (email) => {
    console.log("Setting user email:", email);
    setUserEmail(email);
    localStorage.setItem("email", email);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/"
          element={<Home GetUserEmail={handleUserEmail} />}
        />
        <Route
          path="/user"
          element={(userEmail || localStorage.getItem("email")) ? <User email={userEmail || localStorage.getItem("email")} /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={(userEmail || localStorage.getItem("email")) ? <ProfilePage email={userEmail || localStorage.getItem("email")} /> : <Navigate to="/" />}
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
