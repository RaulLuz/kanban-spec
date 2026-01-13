'use client';

import { useState } from 'react';
import type { Subtask } from '@/types';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (id: string) => Promise<void>;
  onAdd: (title: string) => Promise<void>;
  disabled?: boolean;
}

export function SubtaskList({ subtasks, onToggle, onAdd, disabled = false }: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = subtasks.filter((s) => s.isCompleted).length;
  const totalCount = subtasks.length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || isAdding) return;

    setIsAdding(true);
    try {
      await onAdd(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    } catch (error) {
      console.error('Failed to add subtask:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-body-m text-medium-grey">
          Subtasks ({completedCount} of {totalCount})
        </p>
      </div>

      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <label
            key={subtask.id}
            className="flex items-center gap-3 p-3 bg-light-grey dark:bg-very-dark-grey rounded hover:bg-main-purple hover:bg-opacity-25 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={subtask.isCompleted}
              onChange={() => onToggle(subtask.id)}
              disabled={disabled}
              className="w-4 h-4 rounded border-medium-grey border-opacity-25 bg-white dark:bg-dark-grey checked:bg-main-purple checked:border-main-purple focus:ring-main-purple"
            />
            <span
              className={`text-body-m flex-1 ${
                subtask.isCompleted
                  ? 'line-through opacity-50 text-medium-grey'
                  : 'text-black dark:text-white'
              }`}
            >
              {subtask.title}
            </span>
          </label>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-2">
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add new subtask..."
          disabled={disabled || isAdding}
          className="w-full px-3 py-2 rounded border border-medium-grey border-opacity-25 bg-white dark:bg-dark-grey text-black dark:text-white placeholder:text-medium-grey focus:outline-none focus:border-main-purple"
        />
      </form>
    </div>
  );
}
