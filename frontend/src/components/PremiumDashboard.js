import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { 
  DashboardIcon, 
  CheckIcon, 
  CalendarIcon, 
  BellIcon,
  PlusIcon 
} from './Icons';

const PremiumDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const tasksResponse = await taskAPI.getTasks(0, 10);
      const tasks = tasksResponse.data.content || [];
      
      // Calculate stats
      const now = new Date();
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'PENDING').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED').length
      };
      
      setStats(stats);
      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, gradient, percentage }) => (
    <div className="card-glass group hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {percentage && (
            <p className="text-xs text-neutral-300 mt-1">
              {percentage}% of total
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TaskItem = ({ task }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'HIGH': return 'from-red-400 to-red-600';
        case 'MEDIUM': return 'from-yellow-400 to-orange-500';
        case 'LOW': return 'from-green-400 to-green-600';
        default: return 'from-gray-400 to-gray-600';
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'COMPLETED': return 'text-emerald-400';
        case 'IN_PROGRESS': return 'text-blue-400';
        case 'PENDING': return 'text-amber-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex-1">
          <h4 className="font-medium text-white group-hover:text-purple-300 transition-colors">
            {task.title}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)}`}></div>
            <span className="text-xs text-neutral-400">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
            </span>
          </div>
        </div>
        <CheckIcon className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-300">Welcome back! Here's your productivity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={DashboardIcon}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={CalendarIcon}
            gradient="from-amber-500 to-orange-600"
            percentage={stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={BellIcon}
            gradient="from-blue-500 to-blue-600"
            percentage={stats.total ? Math.round((stats.inProgress / stats.total) * 100) : 0}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckIcon}
            gradient="from-emerald-500 to-emerald-600"
            percentage={stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="card-glass">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-white">Recent Tasks</h2>
                <button className="btn-ghost text-sm py-2 px-4 hover:scale-105 transition-all duration-300">
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <PlusIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-neutral-400">No tasks yet. Create your first task!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card-glass">
              <h3 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300">
                  <PlusIcon className="w-4 h-4" />
                  New Task
                </button>
                <button className="w-full btn-ghost flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300">
                  <CalendarIcon className="w-4 h-4" />
                  View Calendar
                </button>
                <button className="w-full btn-ghost flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300">
                  <BellIcon className="w-4 h-4" />
                  Notifications
                </button>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="card-glass">
              <h3 className="text-lg font-display font-semibold text-white mb-4">Progress Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-300">Completed</span>
                    <span className="text-emerald-400">{stats.completed}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-300">In Progress</span>
                    <span className="text-blue-400">{stats.inProgress}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-300">Pending</span>
                    <span className="text-amber-400">{stats.pending}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Alert */}
            {stats.overdue > 0 && (
              <div className="card-glass border-red-400 bg-red-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <BellIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-200">Overdue Tasks</h4>
                    <p className="text-sm text-red-300">You have {stats.overdue} overdue tasks</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;