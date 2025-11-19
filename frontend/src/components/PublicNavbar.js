import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">Advanced ToDo</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === '/login' 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                location.pathname === '/register' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-500/50' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border border-purple-500/50'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;