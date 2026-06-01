import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const isLoggedIn = Boolean(
    localStorage.getItem('careerpilot_token')
  );

  function handleLogout() {
    localStorage.removeItem('careerpilot_token');
    window.location.href = '/';
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={() => {
                  window.location.href = '/dashboard';
                }}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}