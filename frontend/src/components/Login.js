import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from './PublicNavbar';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginConfig = useMemo(() => ({
    user: {
      gradient: 'from-purple-600 to-pink-600',
      iconBg: 'from-purple-500 to-pink-500',
      title: 'Welcome Back',
      subtitle: 'Sign in to your Advanced ToDo account',
      buttonText: 'Sign In as User'
    },
    admin: {
      gradient: 'from-red-600 to-orange-600',
      iconBg: 'from-red-500 to-orange-500',
      title: 'Admin Access',
      subtitle: 'Administrative login portal',
      buttonText: 'Sign In as Admin'
    }
  }), []);

  const config = loginConfig[loginType];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <PublicNavbar />
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
            {/* Login Type Toggle */}
            <div className="flex mb-8 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setLoginType('user')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  loginType === 'user'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                User Login
              </button>
              <button
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  loginType === 'admin'
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin Login
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {config.title}
              </h2>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder={loginType === 'admin' ? 'Admin username' : 'Enter your username'}
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder={loginType === 'admin' ? 'Admin password' : 'Enter your password'}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-300 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  config.buttonText
                )}
              </button>

              {loginType === 'user' && (
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-gray-800 hover:text-gray-600 transition-colors underline">
                      Sign up here
                    </Link>
                  </p>
                </div>
              )}
              
              {loginType === 'admin' && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Admin access only • Contact system administrator for credentials
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;