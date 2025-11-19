import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';
import { PlusIcon, EditIcon, TrashIcon, ArchiveIcon, CheckIcon } from './Icons';

const TaskListNew = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchTasks();
  }, [currentPage, searchTerm, statusFilter, priorityFilter, sortBy, sortDirection]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchTerm) {
        response = await taskAPI.searchTasks(searchTerm, currentPage, 5, sortBy, sortDirection);
      } else if (statusFilter || priorityFilter) {
        response = await taskAPI.getTasksWithFilters(statusFilter, priorityFilter, currentPage, 5, sortBy, sortDirection);
      } else {
        response = await taskAPI.getTasks(currentPage, 5, sortBy, sortDirection);
      }
      
      setTasks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskAPI.updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      await taskAPI.archiveTask(taskId);
      fetchTasks();
    } catch (err) {
      setError('Failed to archive task');
      console.error('Error archiving task:', err);
    }
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'HIGH': return 'from-red-400 to-red-600';
      case 'MEDIUM': return 'from-yellow-400 to-orange-500';
      case 'LOW': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'COMPLETED': return 'from-emerald-400 to-emerald-600';
      case 'IN_PROGRESS': return 'from-blue-400 to-blue-600';
      case 'PENDING': return 'from-amber-400 to-amber-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">My Tasks</h1>
            <p className="text-neutral-300">Organize your productivity with style</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Task
          </button>
        </div>

        {error && (
          <div className="card-glass border-red-400 bg-red-900/20 text-red-200 p-4 mb-6 animate-fade-in-up">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="card-glass mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-glass"
            >
              <option value="">All Status</option>
              <option value="PENDING">📋 Pending</option>
              <option value="IN_PROGRESS">⚡ In Progress</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-glass"
            >
              <option value="">All Priority</option>
              <option value="HIGH">🔴 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>
            
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="input-glass"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
            </select>
            
            <button
              onClick={clearFilters}
              className="btn-ghost hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid gap-6">
          {tasks.length === 0 ? (
            <div className="card-glass text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <PlusIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-neutral-300 mb-6">Create your first task to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary hover:scale-105 transition-all duration-300"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div 
                key={task.id} 
                className="card-glass group hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-display font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {task.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityGradient(task.priority)}`}>
                        {task.priority}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusGradient(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-neutral-300 mb-4 leading-relaxed">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-neutral-400">
                      {task.dueDate && (
                        <span className="flex items-center gap-2">
                          📅 Due: {new Date(task.dueDate).toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-6">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="input-glass text-sm py-2 px-3 min-w-[120px]"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:scale-110 transition-all duration-300"
                        title="Edit Task"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleArchiveTask(task.id)}
                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:scale-110 transition-all duration-300"
                        title="Archive Task"
                      >
                        <ArchiveIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:scale-110 transition-all duration-300"
                        title="Delete Task"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === i 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110' 
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskListNew;