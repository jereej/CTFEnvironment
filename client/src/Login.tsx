import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './config';

import axios from 'axios';

interface User {
  id: number;
  name: string;
  password: string;
}

const Login: React.FC = () => {
  // Define the state variables for username, error message, loading state, and sign-up mode
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();

  const fetchAllUsers = async (): Promise<User[]> => {
    // Fetch all users from the API
    let allUsers: User[] = [];
    let url = '/api/users/';
    const response = await axios.get(`${API_BASE}${url}`);
    allUsers = [...allUsers, ...response.data];
    return allUsers;
  };

  const handleLoginOrSignUp = async () => {
    // Handle login or sign-up based on the mode
    if (!username.trim()) {
      setError('Please enter a name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const users = await fetchAllUsers();

      const foundUser = users.find((user: User) => user.name.toLowerCase() === username.toLowerCase());

      if (isSignUp) {
        // SIGN UP flow
        if (foundUser) {
          setError('Username already taken.');
        } else {
          const createResponse = await axios.post(`${API_BASE}/api/users/`, { 
            name: username, password: password},  {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(createResponse.data)
          localStorage.setItem('user', JSON.stringify(createResponse.data));
          localStorage.removeItem('isAdmin');
          navigate('/');
        }
      } else {
        // LOGIN flow
        if (foundUser) {
          localStorage.setItem('user', JSON.stringify(foundUser));
          localStorage.removeItem('isAdmin');
          navigate('/');
        } else {
          setError('Username + password combination not found.');
        }
      }
    } catch (err) {
      console.error('Error during login/signup:', err);
      setError('Error connecting to server');
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
