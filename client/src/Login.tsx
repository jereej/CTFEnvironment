import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './config';

import axios from 'axios';

const Login: React.FC = () => {
  // Define the state variables for username, error message, loading state, and sign-up mode
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();

  const handleLoginOrSignUp = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both a username and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // SIGN UP
        const createResponse = await axios.post(`${API_BASE}users/`, {
          name: username,
          password: password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Store the user in localStorage
        const newUser = createResponse.data;
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.removeItem('isAdmin');
        navigate('/');
      } else {
        // LOGIN
        const session_id = localStorage.getItem("ctf_session_id");
        const loginResponse = await axios.post(`${API_BASE}login/`, {
          name: username,
          password: password,
          session_id: session_id
        });

        // Successful login
        const loggedInUser = loginResponse.data;
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.removeItem('isAdmin');
        navigate('/');
      }
    } catch (err: unknown) {
      console.error("Error during login or signup:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error) {
          setError(axiosErr.response.data.error);
          return;
        }
      }
      if (isSignUp) {
        setError(
          "Failed to create account. Ensure username is available and password meets requirements."
        );
      } else {
        setError('Login failed. Check your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="relative flex flex-col items-center justify-center min-h-screen bg-[url('/bakery_overlay.png')] bg-cover bg-center p-4">
    {/* Overlay */}
    <div className="absolute inset-0 bg-[#f2cbea]/70"></div>

    {/* Content */}
    <div className="relative z-10 bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Login'}
      </h1>

      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <button
        onClick={handleLoginOrSignUp}
        className="w-full bg-[#b36be3] text-white py-2 rounded-lg hover:bg-[#794899] transition disabled:opacity-50"
        disabled={loading}
      >
        {loading
          ? (isSignUp ? 'Creating account...' : 'Logging in...')
          : (isSignUp ? 'Create Account' : 'Log In')}
      </button>

      <p className="text-center text-gray-600 mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(prev => !prev)}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Log in' : 'Create one'}
        </button>
      </p>
    </div>
  </div>
);

};

export default Login;
