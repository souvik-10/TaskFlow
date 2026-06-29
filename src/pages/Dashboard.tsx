import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import type { Task } from '../types';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { LogOut, LayoutDashboard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userTasks = await taskService.getUserTasks(user.uid);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateTask = async (data: { title: string; description: string }) => {
    if (!user) return;
    
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, data);
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...data, updatedAt: Date.now() } : t));
        toast.success('Task updated');
        setEditingTask(null);
      } else {
        const newTask = await taskService.createTask({
          ...data,
          completed: false,
          ownerId: user.uid
        });
        setTasks([newTask, ...tasks]);
        toast.success('Task created');
      }
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error.message || 'Failed to save task');
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      await taskService.updateTask(id, { completed: !currentStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus, updatedAt: Date.now() } : t));
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={28} className="text-gradient" />
          <h1 className="text-gradient">TaskFlow</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <TaskForm 
        initialData={editingTask} 
        onSubmit={handleCreateOrUpdateTask} 
        onCancel={editingTask ? () => setEditingTask(null) : undefined}
      />

      {loading ? (
        <div className="empty-state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state glass-panel">
          <h3>No tasks yet</h3>
          <p style={{ marginTop: '8px' }}>Add a task above to get started!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={setEditingTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
