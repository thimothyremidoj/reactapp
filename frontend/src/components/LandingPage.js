import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: 'Smart Task Management',
      description: 'Create, organize, and track tasks with intelligent prioritization and status management.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Calendar Integration',
      description: 'Visualize your tasks in an interactive calendar view with due date tracking.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1a3 3 0 006 0V4h3.5c.169 0 .334.014.497.042m-12.238 0A4 4 0 004 8v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-.758-2.342m-12.238 0L20.242 5.758" />
        </svg>
      ),
      title: 'Automated Reminders',
      description: 'Never miss a deadline with smart notifications and overdue task alerts.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Real-time Updates',
      description: 'Instant synchronization across all your devices with live task updates.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      title: 'Priority Management',
      description: 'Focus on what matters most with intelligent task prioritization system.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Advanced Search',
      description: 'Find any task instantly with powerful search and filtering capabilities.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        <PublicNavbar />

        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <div className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium mb-6">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Advanced Task Management System
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Advanced ToDo App
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  with Calendar & Reminders
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                A powerful full-stack productivity platform with task management, calendar integration, 
                automated reminders, and role-based access control.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-purple-500/50"
                >
                  Get Started Free
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Sign In →
                </button>
              </div>
              
              {/* Feature Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { 
                    title: 'Task Management', 
                    desc: 'Create, organize & track tasks', 
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    )
                  },
                  { 
                    title: 'Calendar View', 
                    desc: 'Visual timeline & due dates', 
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )
                  },
                  { 
                    title: 'Smart Reminders', 
                    desc: 'Automated notifications', 
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1a3 3 0 006 0V4h3.5c.169 0 .334.014.497.042m-12.238 0A4 4 0 004 8v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-.758-2.342m-12.238 0L20.242 5.758" />
                      </svg>
                    )
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="text-purple-400 mb-3">{item.icon}</div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Premium Features
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Discover the revolutionary features that redefine productivity
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`card-glass group hover:scale-105 transition-all duration-500 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section id="cta" className="py-20 relative">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to Boost Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Productivity?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Start managing your tasks efficiently with our advanced todo application
              </p>
              
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-purple-500/50"
              >
                Get Started Now →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 relative border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center text-xl font-bold mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-white">Advanced ToDo</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Full-stack task management with calendar integration and automated reminders.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Task Management</li>
                  <li>Calendar Integration</li>
                  <li>Email Reminders</li>
                  <li>User Authentication</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Secure Authentication</li>
                  <li>Data Protection</li>
                  <li>Role-based Access</li>
                  <li>Privacy Focused</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-12 pt-8 text-center">
              <p className="text-gray-400">
                &copy; 2024 Advanced ToDo App. Built for productivity.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;