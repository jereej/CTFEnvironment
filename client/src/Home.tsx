import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from './config';
import Confetti from "react-confetti";
import InstructionPopup from './InstructionPopup';

const Home: React.FC = () => {
  // State to manage user login status
  // and user information
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const instructions = 
  `Welcome to the website of Les Baguettes.

This website acts as the CTF environment where there are various tasks for you to complete.

You can start by either creating an account or by logging in. Feel free to also just have a look around without an account but
you will not be able to place orders without an account.

In total there are 4 tasks for you to complete in (and outside) of this website. When you have completed an exercise, you can
return the flag through the 'Flags' button and keep track of exercises you have completed so far.

To keep things interesting, you will have to find the exercises by yourself. However, to help you get started, look for a newspaper. That might have some interesting information 😉.

Good luck and have fun with the tasks! `

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    // and set the user state accordingly
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]); // Depend on location changes!

  useEffect(() => {
  const sessionId = localStorage.getItem("ctf_session_id");
  if (!sessionId) return;

  axios
    .get(`${API_BASE}progress/get/${sessionId}/`)
    .then(res => setProgress(res.data))
    .catch(err => console.error("Failed to fetch progress:", err));
  }, []);

  useEffect(() => {
  if (!user || !progress) return;

  if (user.name.toLowerCase() === "brittnney13" && progress.task1_done === false) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }
  }, [user, progress]); 

  const handleLogout = () => {
    // Clear user data from localStorage and reset user state
    // Redirect to home page
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setUser(null);
    navigate('/');
  };
return (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-[url('/bakery_overlay.png')] bg-cover bg-center p-4">
    {/* Overlay */}
    <div className="absolute inset-0 bg-[#f2cbea]/70"/>
    {showConfetti && (
    <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={500}
        recycle={false}
    />
    )}
    <Link to="/backrooms" className="absolute top-8 left-8 z-20">
        <img
          src="/door_logo.png"
          className="h-12 w-auto hover:scale-105 transition-transform"
          style={{ width: '100px', height: '100px', objectFit: 'contain'}}
        />
      </Link>
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/baguette_logo.png" 
          alt="Restaurant Logo"
          style={{ width: '600px', height: '400px', objectFit: 'contain', borderRadius: '33%' }}
        />
      </div>

      {/* Welcome user */}
      {user && (
        <p className="text-black-700 mb-6 text-lg font-semibold">
          Welcome, {user.name}!
        </p>
      )}

      {user && user.name.toLowerCase() === "brittnney13" &&
      progress &&
      progress.task1_done === false && (
        <p className="text-black mb-6 text-lg font-bold">
          BAGUETTE{`{task1_tempflag}`}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-row gap-4">
        {user ? (
          <>
            <Link to="/menu">
              <button className="px-6 py-3 bg-[#f4e8fc] text-black rounded-2xl hover:bg-[#b099bf] transition">
                View Menu
              </button>
            </Link>

            <Link to="/orders">
              <button className="px-6 py-3 bg-[#f4e8fc] text-black rounded-2xl hover:bg-[#b099bf] transition">
                Orders
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-[#f4e8fc] text-black rounded-2xl hover:bg-[#b099bf] transition">
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/menu">
              <button className="px-6 py-3 bg-[#f4e8fc] text-black rounded-2xl hover:bg-[#b099bf] transition">
                View Menu
              </button>
            </Link>

            <Link to="/login">
              <button className="px-6 py-3 bg-[#f4e8fc] text-black rounded-2xl hover:bg-[#b099bf] transition">
                Log In
              </button>
            </Link>
          </>
        )}
        <Link to="/admin">
          <button className="px-6 py-3 bg-[#f4e8fc] text-black rounded-2xl hover:bg-[#b099bf] transition">
            Admin
          </button>
        </Link>
      </div>
    </div>
    <InstructionPopup
    onClose={()=>{}}
    text={instructions}
    popupSource="home"></InstructionPopup>
  </div>
);

};

export default Home;
