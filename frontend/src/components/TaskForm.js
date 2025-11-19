import React, { useState, useEffect } from 'react';
import { PlusIcon, EditIcon } from './Icons';

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? formData.dueDate : null
    };
    onSave(taskData);
  };

  const priorityColors = {
    LOW: 'from-gray-400 to-gray-500',
    MEDIUM: 'from-yellow-400 to-orange-500',
    HIGH: 'from-red-400 to-red-600'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="card-glass w-full max-w-md animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            {task ? <EditIcon className="w-5 h-5 text-white" /> : <PlusIcon className="w-5 h-5 text-white" />}
          </div>
          <h3 className="text-xl font-display font-semibold text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-200">Task Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className="input-glass w-full transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-200">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add task description..."
              className="input-glass w-full resize-none transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-200">Priority Level</label>
            <div className="relative">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-glass w-full appearance-none cursor-pointer"
              >
                <option value="LOW">🟢 Low Priority</option>
                <option value="MEDIUM">🟡 Medium Priority</option>
                <option value="HIGH">🔴 High Priority</option>
              </select>
              <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${priorityColors[formData.priority]}`}></div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-200">Due Date & Time</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-glass w-full transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-ghost flex-1 transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              {task ? <EditIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;