import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

const TestCRUD = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAllTasks();
      setTasks(response.data || []);
      setMessage(`Loaded ${response.data?.length || 0} tasks successfully`);
    } catch (error) {
      setMessage('Failed to load tasks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      setMessage('Please enter a task title');
      return;
    }

    try {
      setLoading(true);
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
      };
      await taskAPI.createTask(taskData);
      setMessage('Task created successfully');
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
      loadTasks();
    } catch (error) {
      setMessage('Failed to create task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      setLoading(true);
      await taskAPI.updateTaskStatus(taskId, status);
      setMessage(`Task status updated to ${status}`);
      loadTasks();
    } catch (error) {
      setMessage('Failed to update task status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      await taskAPI.deleteTask(taskId);
      setMessage('Task deleted successfully');
      loadTasks();
    } catch (error) {
      setMessage('Failed to delete task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CRUD Operations Test</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Create Task Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input
            type="datetime-local"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={createTask}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          className="w-full mt-4 border border-gray-300 rounded px-3 py-2"
          rows="3"
        />
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tasks ({tasks.length})</h2>
          <button
            onClick={loadTasks}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCRUD;