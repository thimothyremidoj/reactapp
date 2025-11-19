import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

const Calendar = ({ tasks, onTaskUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadCalendarTasks();
  }, [currentDate]);

  useEffect(() => {
    console.log('Calendar received tasks:', tasks);
    if (tasks && tasks.length >= 0) {
      setCalendarTasks(tasks);
    } else {
      loadCalendarTasks();
    }
  }, [tasks]);

  const loadCalendarTasks = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await taskAPI.getTasksByDateRange(
        startOfMonth.toISOString(),
        endOfMonth.toISOString()
      );
      setCalendarTasks(response.data || []);
    } catch (error) {
      console.error('Failed to load calendar tasks:', error);
      setCalendarTasks([]);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getTasksForDate = (day) => {
    if (!day) return [];
    
    return calendarTasks.filter(task => {
      if (!task.dueDate) return false;
      
      // Handle both ISO string and LocalDateTime formats
      let taskDate;
      if (typeof task.dueDate === 'string') {
        // Handle ISO string format
        taskDate = new Date(task.dueDate);
      } else if (Array.isArray(task.dueDate)) {
        // Handle LocalDateTime array format [year, month, day, hour, minute, second]
        taskDate = new Date(task.dueDate[0], task.dueDate[1] - 1, task.dueDate[2]);
      } else {
        taskDate = new Date(task.dueDate);
      }
      
      return taskDate.getDate() === day && 
             taskDate.getMonth() === currentDate.getMonth() && 
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const days = getDaysInMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-cyan-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-cyan-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-3 border border-cyan-300 rounded-lg hover:bg-cyan-100 hover:border-cyan-400 hover:text-cyan-700 transition-all duration-200 transform hover:scale-105 bg-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-3 border border-cyan-300 rounded-lg hover:bg-cyan-100 hover:border-cyan-400 hover:text-cyan-700 transition-all duration-200 transform hover:scale-105 bg-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-teal-700 bg-teal-100 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const tasksForDay = getTasksForDate(day);
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`min-h-[100px] p-3 border-2 cursor-pointer rounded-lg transition-all duration-200 ${
                day 
                  ? 'bg-white border-cyan-200 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md transform hover:-translate-y-1' 
                  : 'bg-cyan-50 border-cyan-100'
              }`}
            >
              {day && (
                <>
                  <div className="text-lg font-semibold text-teal-800 mb-2">{day}</div>
                  <div className="space-y-1">
                    {tasksForDay.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-2 rounded-lg truncate shadow-sm hover:shadow-md transition-shadow duration-200 ${
                          task.priority === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-green-100 text-green-800 border border-green-200'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {tasksForDay.length > 2 && (
                      <div className="text-xs text-indigo-600 font-medium bg-indigo-50 p-1 rounded">
                        +{tasksForDay.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            Tasks for {selectedDate.toLocaleDateString()}
          </h3>
          {getTasksForDate(selectedDate.getDate()).length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">No tasks scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getTasksForDate(selectedDate.getDate()).map(task => (
                <div key={task.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-500' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{task.title}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;