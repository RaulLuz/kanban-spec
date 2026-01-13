'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '../task/TaskForm';
import { useTask } from '@/lib/hooks/useTask';
import type { Column } from '@/types';

// Close modal on Escape key for all modals
const useModalClose = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
};

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  boardId: string;
  columns: Column[];
  onTaskCreated?: () => void;
}

export function AddTaskModal({
  isOpen,
  onClose,
  columnId,
  boardId,
  columns,
  onTaskCreated,
}: AddTaskModalProps) {
  const { createTask, loading } = useTask();
  const [selectedColumnId, setSelectedColumnId] = useState(columnId);

  useEffect(() => {
    setSelectedColumnId(columnId);
  }, [columnId]);

  useModalClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (title: string, description: string | null) => {
    await createTask(selectedColumnId, boardId, title, description);
    onTaskCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-grey rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-heading-l text-black dark:text-white mb-6">Add New Task</h2>

        <div className="mb-6">
          <label htmlFor="task-column" className="block text-body-m text-medium-grey mb-2">
            Status
          </label>
          <select
            id="task-column"
            value={selectedColumnId}
            onChange={(e) => setSelectedColumnId(e.target.value)}
            className="w-full px-4 py-2 rounded border border-medium-grey border-opacity-25 bg-white dark:bg-dark-grey text-black dark:text-white focus:outline-none focus:border-main-purple"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <TaskForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Create Task"
          loading={loading}
        />
      </div>
    </div>
  );
}
