import React from 'react';

const TaskList = ({ tasks, onStatusUpdate, onEdit, onDelete, onSetReminder, onArchive, showArchived = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-300 bg-red-900/30 border-red-500/30';
      case 'MEDIUM': return 'text-yellow-300 bg-yellow-900/30 border-yellow-500/30';
      case 'LOW': return 'text-green-300 bg-green-900/30 border-green-500/30';
      default: return 'text-gray-300 bg-gray-900/30 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-300 bg-emerald-900/30 border-emerald-500/30';
      case 'IN_PROGRESS': return 'text-blue-300 bg-blue-900/30 border-blue-500/30';
      case 'PENDING': return 'text-orange-300 bg-orange-900/30 border-orange-500/30';
      default: return 'text-gray-300 bg-gray-900/30 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No tasks yet</h3>
        <p className="text-gray-300">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-xl font-semibold text-white hover:text-purple-300 transition-colors duration-200">{task.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              
              {task.description && (
                <p className="text-gray-300 mb-3 leading-relaxed">{task.description}</p>
              )}
              
              <div className="flex items-center text-sm text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Due: {formatDate(task.dueDate)}
              </div>
            </div>

            <div className="flex flex-col space-y-3 ml-6">
              <select
                value={task.status}
                onChange={(e) => onStatusUpdate(task.id, e.target.value)}
                className="input-glass text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onSetReminder(task.id)}
                  className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 hover:text-blue-200 transition-all duration-200 hover:scale-105 flex items-center space-x-1 border border-blue-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  </svg>
                  <span>Remind</span>
                </button>
                
                <button
                  onClick={() => onEdit(task)}
                  className="bg-purple-500/20 text-purple-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/30 hover:text-purple-200 transition-all duration-200 hover:scale-105 flex items-center space-x-1 border border-purple-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                
                {!showArchived && onArchive && (
                  <button
                    onClick={() => onArchive(task.id)}
                    className="bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500/30 hover:text-yellow-200 transition-all duration-200 hover:scale-105 flex items-center space-x-1 border border-yellow-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                    </svg>
                    <span>Archive</span>
                  </button>
                )}
                
                <button
                  onClick={() => onDelete(task.id)}
                  className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 hover:text-red-200 transition-all duration-200 hover:scale-105 flex items-center space-x-1 border border-red-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;