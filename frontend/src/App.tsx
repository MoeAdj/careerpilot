import { useState } from 'react';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('careerpilot_token')));

  function handleLogout() {
    localStorage.removeItem('careerpilot_token');
    setIsLoggedIn(false);
  }

  return (
    <div className="min-h-screen">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {isLoggedIn ? <Dashboard /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
}
