import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h1>
      <div className="mb-8">
        <img
          src="/notfound.png"
          alt="Restaurant Logo"
          className="w-[280px] h-[190px] sm:w-[400px] sm:h-[270px] md:w-[600px] md:h-[400px] object-contain"
          style={{ borderRadius: '95%' }}
        />
      </div>
      <p className="text-xl text-gray-600 mb-4">Oh no! This page is not found!</p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;