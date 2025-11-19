import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

const getCurrentUsername = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
};

const validateApiEndpoint = (endpoint) => {
  const allowedEndpoints = ['/tasks', '/users', '/admin', '/reminders', '/auth'];
  return allowedEndpoints.some(allowed => endpoint.startsWith(allowed));
};

export const taskAPI = {
  getTasks: (page = 0, size = 5, sortBy = 'createdAt', sortDir = 'desc') => {
    const username = getCurrentUsername();
    return api.get('/tasks', { params: { page, size, sortBy, sortDir, ...(username && { username }) } });
  },
  getAllTasks: () => {
    const username = getCurrentUsername();
    return api.get('/tasks/all', { params: { ...(username && { username }) } });
  },
  getAllTasksForAdmin: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => 
    api.get('/tasks/admin/all', { params: { page, size, sortBy, sortDir } }),
  getAllTasksForAdminSimple: () => api.get('/tasks/admin/all-simple'),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  updateTaskStatus: (id, status) => api.put(`/tasks/${id}/status?status=${status}`),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  archiveTask: (id) => api.put(`/tasks/${id}/archive`),
  unarchiveTask: (id) => api.put(`/tasks/${id}/unarchive`),
  getArchivedTasks: () => api.get('/tasks/archived'),
  searchTasks: (keyword, page = 0, size = 10) => 
    api.get(`/tasks/search?keyword=${keyword}&page=${page}&size=${size}`),
  getTasksWithFilters: (params) => api.get('/tasks', { params }),
  searchTasksAdvanced: (params) => api.get('/tasks/search', { params }),
  getTasksByStatus: (status) => api.get(`/tasks/status/${status}`),
  getTasksByPriority: (priority) => api.get(`/tasks/priority/${priority}`),
  getTasksByDateRange: (start, end) => {
    const username = getCurrentUsername();
    const params = new URLSearchParams({ start, end, ...(username && { username }) });
    return api.get(`/tasks/calendar?${params}`);
  },
  getOverdueTasks: () => api.get('/tasks/overdue'),
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/me/password', data),
  updateProfile: (data) => api.put('/users/me', data),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role?role=${role}`),
};

export const reminderAPI = {
  createReminder: (reminder) => api.post('/reminders', reminder),
  getRemindersByTask: (taskId) => api.get(`/reminders/task/${taskId}`),
  getPendingReminders: () => api.get('/reminders/pending'),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
};

export default api;