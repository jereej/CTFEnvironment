import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const NavBar: React.FC = () => {
  const [user, setUser] = useState<{ id: number; name: string; has_premium?: boolean } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    // Load admin status
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#dabed6] shadow-md flex justify-between items-center px-8 py-3">
      
      {/* Left: Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/common_logo.png"
          alt="Les Baguettes Logo"
          className="h-12 w-auto rounded-md transition"
        />
      </Link>

      {/* Right: Navigation */}
      <div className="flex items-center gap-6">

        <Link to="/submit-flags/" className="text-gray-700 hover:text-blue-600 font-semibold">
          Flags
        </Link>

        {/* User Navigation */}
        {!isAdmin && (
          <>
            <Link to="/menu" className="text-gray-700 hover:text-blue-600 font-semibold">
              Menu
            </Link>

            {user ? (
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-semibold">
                Orders
              </Link>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-semibold">
                Login
              </Link>
            )}
          </>
        )}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <Link to="/admin/menu" className="text-gray-700 hover:text-blue-600 font-semibold">
              Manage Menu
            </Link>
            <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600 font-semibold">
              Manage Orders
            </Link>
          </>
        )}

        {/* User Badge + Logout */}
        {user && (
          <div className="flex items-center gap-3">
            
            {/* Username + Premium badge */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{user.name}</span>

              {user.has_premium && (
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow font-bold">
                  PREMIUM
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold shadow-sm"
            >
              Logout
            </button>
          </div>
        )}

      </div>

    </nav>
  );
};

export default NavBar;
