import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskAPI, reminderAPI } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Calendar from './Calendar';
import ReminderForm from './ReminderForm';
import Navbar from './Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTaskId, setReminderTaskId] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    sortDir: 'desc'
  });

  useEffect(() => {
    loadTasks();
    loadAllTasks();
    checkReminders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async (page = 0) => {
    try {
      const params = {
        page,
        size: pagination.size,
        sortBy: sortConfig.sortBy,
        sortDir: sortConfig.sortDir
      };
      
      if (filters.status !== 'all') params.status = filters.status.toUpperCase();
      if (filters.priority !== 'all') params.priority = filters.priority.toUpperCase();
      
      const response = await taskAPI.getTasks(params.page, params.size, params.sortBy, params.sortDir);
      setTasks(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 5,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0
      });
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTasks = async () => {
    try {
      const response = await taskAPI.getAllTasks();
      setAllTasks(response.data || []);
    } catch (error) {
      console.error('Failed to load all tasks for calendar');
    }
  };

  const checkReminders = async () => {
    try {
      const response = await taskAPI.getOverdueTasks();
      if (response.data.length > 0) {
        toast.warning(`You have ${response.data.length} overdue tasks!`);
      }
    } catch (error) {
      console.error('Failed to check reminders');
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status.toUpperCase());
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority.toUpperCase());
    }
    
    setFilteredTasks(filtered);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskAPI.createTask(taskData);
        toast.success('Task created successfully');
      }
      loadTasks(pagination.page);
      loadAllTasks();
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleTaskStatusUpdate = async (taskId, status) => {
    try {
      await taskAPI.updateTaskStatus(taskId, status);
      toast.success('Task status updated');
      loadTasks(pagination.page);
      loadAllTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        toast.success('Task deleted successfully');
        loadTasks(pagination.page);
        loadAllTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSetReminder = (taskId) => {
    setReminderTaskId(taskId);
    setShowReminderForm(true);
  };

  const handleReminderSave = async (reminderData) => {
    try {
      await reminderAPI.createReminder(reminderData);
      toast.success('Reminder set successfully');
      setShowReminderForm(false);
      setReminderTaskId(null);
    } catch (error) {
      toast.error('Failed to set reminder');
    }
  };

  const handleTaskArchive = async (taskId) => {
    if (window.confirm('Are you sure you want to archive this task?')) {
      try {
        await taskAPI.archiveTask(taskId);
        toast.success('Task archived successfully');
        loadTasks(pagination.page);
        loadAllTasks();
      } catch (error) {
        toast.error('Failed to archive task');
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Only reload from server for status/priority changes, not search
    if (filterType !== 'search') {
      loadTasks(0);
    }
  };
  
  const handleSortChange = (sortBy) => {
    const newSortDir = sortConfig.sortBy === sortBy && sortConfig.sortDir === 'desc' ? 'asc' : 'desc';
    setSortConfig({ sortBy, sortDir: newSortDir });
    loadTasks(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-12 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-slate-700 text-xl font-medium">Loading your workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        
        <div className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* Welcome Header */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8 shadow-xl shadow-blue-500/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 mb-1">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!</h1>
                  <p className="text-slate-600 text-lg">Let's make today productive ✨</p>
                </div>
              </div>
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-800 mb-1">{tasks.length}</p>
                  <p className="text-slate-600 font-medium">Total Tasks</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-800 mb-1">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
                  <p className="text-slate-600 font-medium">Completed</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-800 mb-1">{tasks.filter(t => t.status === 'PENDING').length}</p>
                  <p className="text-slate-600 font-medium">Pending</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-2 mb-8 shadow-lg">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'tasks'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Tasks</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <span>Calendar</span>
              </button>
            </nav>
          </div>

        {activeTab === 'tasks' && (
          <>
            {/* Filters */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-80">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search tasks by title or description..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="px-4 py-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 font-medium"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <TaskList
              tasks={filteredTasks}
              onStatusUpdate={handleTaskStatusUpdate}
              onEdit={handleTaskEdit}
              onDelete={handleTaskDelete}
              onSetReminder={handleSetReminder}
              onArchive={handleTaskArchive}
            />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-8 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
                <div className="text-slate-600">
                  Showing <span className="font-semibold text-slate-800">{pagination.page * pagination.size + 1}-{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of <span className="font-semibold text-slate-800">{pagination.totalElements}</span> tasks
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => loadTasks(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-6 py-3 bg-white/80 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-white hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-3 text-slate-600 font-medium">
                    {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => loadTasks(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-6 py-3 bg-white/80 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-white hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'calendar' && (
          <Calendar tasks={allTasks} onTaskUpdate={loadAllTasks} />
        )}

        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSave={handleTaskSave}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {showReminderForm && (
          <ReminderForm
            taskId={reminderTaskId}
            onSave={handleReminderSave}
            onCancel={() => {
              setShowReminderForm(false);
              setReminderTaskId(null);
            }}
          />
        )}
        </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;