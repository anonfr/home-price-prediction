import React, { useState } from 'react';
import { Home, Moon, Sun } from 'lucide-react';
import Login from './Login';
import Signup from './Signup';

interface AuthPageProps {
  onAuthenticated: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 dark:from-black dark:to-black p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-rose-600 dark:text-rose-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">House Price Predictor</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {isLogin ? (
            <Login
              onLogin={onAuthenticated}
              onSwitchToSignup={() => setIsLogin(false)}
            />
          ) : (
            <Signup
              onSignup={onAuthenticated}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 