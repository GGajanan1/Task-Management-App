import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';
import { Context } from '../main';
import axios from 'axios';
import './EditTask.css'

const EditTask = () => {
  const [task, setTask] = useState({
    name: '',
    priority: 1,
    isDone: false,
    startTime: '',
    endTime: '',
  });

  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/task/getTask/${id}`, {
          withCredentials: true,
        });
        console.log(response.data.task)
        const { name, priority, isDone, startTime, endTime } = response.data.task;
        const formatDate = (date) => {
          const d = new Date(date);
          return d.toISOString().slice(0, 16);  // Extract yyyy-MM-ddThh:mm format
        };

        setTask({
          name,
          priority,
          isDone,
          startTime: formatDate(startTime),
          endTime: formatDate(endTime),
        });
        toast.success('Task fetched successfully');
      } catch (error) {
        console.log('Error fetching task:', error);
        toast.error('Error fetching task');
      }
    };

    fetchTask();
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/v1/task/updateTask/${id}`,
        task,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Task updated successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Error updating task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task');
    }
  };

  return (
    <div className="update-task">
      <h1>Update Task</h1>
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
        <button type="submit" className="btn-update">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
