import React, { useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskFormProps {
  initialData?: Task | null;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ title, description });
      if (!initialData) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="glass-panel" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <div className="input-group">
        <input
          type="text"
          className="input-field"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <textarea
          className="input-field"
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{ resize: 'vertical' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
          {loading ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};
