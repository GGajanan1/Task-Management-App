import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/task/getAllTasks",{
            withCredentials:true
        });
        setTasks(response.data.tasks);
        // console.log(response.data);
      } catch (error) {
        console.log('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [isAuthenticated, navigate]);

  const handleUpdate = (taskId) => {
    navigate(`/updateTask/${taskId}`);
    console.log('Update task with ID:', taskId);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/task/deleteTask/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard">
      <h1>Task Dashboard</h1>
      <br />
      <div className="tasks-container">
        {tasks && tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.name}</h3>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.isDone ? 'Completed' : 'Pending'}</p>
            <p>Start Time: {new Date(task.startTime).toLocaleString()}</p>
            <p>End Time: {new Date(task.endTime).toLocaleString()}</p>
            <div className="task-actions">
              <button onClick={() => handleUpdate(task._id)} className="update-btn">Edit</button>
              <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
