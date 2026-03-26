import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { fetchAPI } from './api';

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
  const [userEmail, setUserEmail] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Don't check localStorage, rely strictly on backend session
      const result = await fetchAPI("/check-auth", { method: "GET" });
      if (result.ok && result.data?.email) {
        setUserEmail(result.data.email);
      } else {
        setUserEmail("");
      }
      setIsAuthChecking(false);
    };
    checkAuth();
  }, []);

  const handleUserEmail = (email) => {
    console.log("Session authenticated for:", email);
    setUserEmail(email);
  };

  const handleLogout = async () => {
    await fetchAPI("/logout", { method: "POST" });
    setUserEmail("");
  };

  if (isAuthChecking) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/"
          element={userEmail ? <Navigate to="/user" /> : <Home GetUserEmail={handleUserEmail} />}
        />
        <Route
          path="/user"
          element={userEmail ? <User email={userEmail} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={userEmail ? <ProfilePage email={userEmail} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
