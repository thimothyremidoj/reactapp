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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            <span className="text-gray-800 text-lg">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        
        <div className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="bg-white border border-gray-300 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                  <p className="text-gray-600">Ready to tackle your tasks today?</p>
                </div>
              </div>
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
                  <p className="text-gray-600 text-sm">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{tasks.filter(t => t.status === 'PENDING').length}</p>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-300 rounded-xl p-2 mb-8 shadow">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'tasks'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>My Tasks</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'calendar'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <span>Calendar View</span>
              </button>
            </nav>
          </div>

        {activeTab === 'tasks' && (
          <>
            {/* Simple Filters */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8 shadow">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search your tasks..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
            
            {/* Simple Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-8 bg-white border border-gray-300 rounded-xl p-6 shadow">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">{pagination.page * pagination.size + 1}-{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of <span className="font-semibold text-gray-800">{pagination.totalElements}</span> tasks
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadTasks(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => loadTasks(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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