import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../main';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SummaryPage.css';

const SummaryPage = () => {
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [averageTime, setAverageTime] = useState(0);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to view the task summary!');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/task/getAllTasks', {
          withCredentials: true,
        });
        const taskData = response.data.tasks;
        setTasks(taskData);

        const completed = taskData.filter(task => task.isDone);
        setCompletedTasks(completed);

        const pending = taskData.filter(task => !task.isDone);
        setPendingTasks(pending);

        const totalCompletedTime = completed.reduce((acc, task) => {
          const start = new Date(task.startTime);
          const end = new Date(task.endTime);
          return acc + (end - start);
        }, 0);

        const avgTime = completed.length
          ? totalCompletedTime / completed.length / 1000 / 60 // average time in minutes
          : 0;
        setAverageTime(avgTime);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Error fetching tasks');
      }
    };

    fetchTasks();
  }, [isAuthenticated]);

  const totalTasks = tasks.length;
  const completedPercentage = totalTasks ? (completedTasks.length / totalTasks) * 100 : 0;
  const notCompletedPercentage = totalTasks ? (pendingTasks.length / totalTasks) * 100 : 0;

  const pendingTaskTimeLapsed = pendingTasks.reduce((acc, task) => {
    const start = new Date(task.startTime);
    const now = new Date();
    return acc + (now - start);
  }, 0);

  const pendingTaskTotalTimeToFinish = pendingTasks.reduce((acc, task) => {
    const end = new Date(task.endTime);
    const now = new Date();
    return acc + (end - now);
  }, 0);

  return (
    <div className="summary-page">
      <h1>Task Summary</h1>
      <div className="summary-card">
        <h2>Total Tasks</h2>
        <p>{totalTasks}</p>
      </div>
      <div className="summary-card">
        <h2>Completed Tasks Percentage</h2>
        <p>{completedPercentage.toFixed(2)}%</p>
      </div>
      <div className="summary-card">
        <h2>Not Completed Tasks Percentage</h2>
        <p>{notCompletedPercentage.toFixed(2)}%</p>
      </div>
      <div className="summary-card">
        <h2>Average Time per Completed Task</h2>
        <p>{averageTime.toFixed(2)} minutes</p>
      </div>
      <div className="summary-card">
        <h2>Pending Task Summary</h2>
        <p><strong>Total Pending Tasks:</strong> {pendingTasks.length}</p>
        <p><strong>Total Time Lapsed:</strong> {Math.floor(pendingTaskTimeLapsed / (1000 * 60))} minutes</p>
        <p><strong>Total Time to Finish:</strong> {Math.floor(pendingTaskTotalTimeToFinish / (1000 * 60))} minutes</p>
      </div>
    </div>
  );
};

export default SummaryPage;
