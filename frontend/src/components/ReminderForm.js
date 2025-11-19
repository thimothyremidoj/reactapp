import React, { useState } from 'react';

const ReminderForm = ({ taskId, onSave, onCancel }) => {
  const [reminderTime, setReminderTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      taskId,
      reminderTime: new Date(reminderTime).toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Set Reminder</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reminder Time</label>
            <input
              type="datetime-local"
              required
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">
              Set Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;
