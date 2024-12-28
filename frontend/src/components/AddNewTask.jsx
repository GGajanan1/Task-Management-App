import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';
import { Context } from '../main';
import axios from 'axios';
import './AddNewTask.css'

const AddNewTask = () => {
  const [task, setTask] = useState({
    name: '',
    priority: 1,
    isDone: false,
    startTime: '',
    endTime: '',
  });

  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('You must be logged in to add a task!');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/task/addTask',
        task,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        toast.success('Task added successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Error adding task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task');
    }
  };

  return (
    <div className="add-task">
      <h1>Add New Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <input
            type="number"
            name="priority"
            value={task.priority}
            min="1"
            max="5"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <input
            type="checkbox"
            name="isDone"
            checked={task.isDone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={task.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={task.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddNewTask;
