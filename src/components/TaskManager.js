import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // ✅ Wrap fetchTasks in useCallback so it doesn't change on every render
  const fetchTasks = useCallback(() => {
    axios.get(`${BACKEND_URL}/api/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, [BACKEND_URL]);

  // ✅ useEffect now safely depends on fetchTasks
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    axios.post(`${BACKEND_URL}/api/tasks`, { task: newTask, due_date: dueDate })
      .then(res => {
        setTasks(prev => [...prev, res.data]);
        setNewTask('');
        setDueDate('');
      })
      .catch(err => console.error('Error adding task:', err));
  };

  const deleteTask = (id) => {
    axios.delete(`${BACKEND_URL}/api/tasks/${id}`)
      .then(fetchTasks)
      .catch(err => console.error('Error deleting task:', err));
  };

  const toggleComplete = (id, currentStatus) => {
    axios.put(`${BACKEND_URL}/api/tasks/${id}`, { status: currentStatus === 'completed' ? 'pending' : 'completed' })
      .then(fetchTasks)
      .catch(err => console.error('Error updating status:', err));
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.task);
  };

  const saveEdit = (id) => {
    axios.put(`${BACKEND_URL}/api/tasks/${id}`, { task: editText })
      .then(() => {
        fetchTasks();
        setEditTaskId(null);
        setEditText('');
      })
      .catch(err => console.error('Error editing task:', err));
  };

  return (
    <div className="task-manager">
      <h2>📋 Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>💾 Save</button>
                </>
              ) : (
                <>
                  <p className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>📝 {task.task}</p>
                  <p className="task-info">
                    <span>Status: <strong>{task.status}</strong></span><br />
                    <span>Created At: <strong>{new Date(task.created_at).toLocaleString()}</strong></span><br />
                    <span>Due Date: <strong>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</strong></span>
                  </p>
                  <button onClick={() => toggleComplete(task.id, task.status)}>
                    {task.status === 'completed' ? '↩️ Mark Pending' : '✔️ Complete'}
                  </button>
                  <button onClick={() => startEdit(task)}>✏️ Edit</button>
                  <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
