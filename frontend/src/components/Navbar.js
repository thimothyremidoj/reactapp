import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">Advanced ToDo</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, <span className="text-white font-medium">{user?.username}</span></span>
            
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/10"
              >
                Admin Panel
              </Link>
            )}
            
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/10"
            >
              Dashboard
            </Link>
            
            <Link
              to="/profile"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/10"
            >
              Profile
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

};

export default Navbar;