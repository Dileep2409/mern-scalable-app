import { createContext, useState, useContext, useEffect } from 'react';
import { tasks as taskApi } from '../utils/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await taskApi.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const { data } = await taskApi.create(taskData);
      setTasks(prev => [...prev, data]);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to create task' 
      };
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data } = await taskApi.update(id, updates);
      setTasks(prev => prev.map(task => 
        task._id === id ? { ...task, ...data } : task
      ));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update task' 
      };
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskApi.delete(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to delete task' 
      };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider 
      value={{
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        refetchTasks: fetchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
