import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';
import { 
  DashboardIcon, 
  CalendarIcon, 
  BellIcon, 
  UserIcon, 
  SunIcon, 
  MoonIcon 
} from './Icons';

const PremiumNavbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
    { name: 'Calendar', icon: CalendarIcon, href: '/calendar' },
    { name: 'Notifications', icon: BellIcon, href: '/notifications' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', icon: UserIcon, href: '/admin' });
  }

  return (
    <nav className="card-glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Advanced ToDo</h1>
              <p className="text-xs text-purple-300">Task Management System</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-neutral-400">{user?.role}</p>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="btn-ghost text-sm py-2 px-4 hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavbar;