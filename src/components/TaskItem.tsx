import React from 'react';
import type { Task } from '../types';
import { Trash2, Edit2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id, task.completed)}
        aria-label="Mark task as complete"
      />
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
      </div>
      <div className="task-actions">
        <button 
          className="btn-icon" 
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button 
          className="btn-icon" 
          style={{ color: 'var(--danger)' }} 
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
