'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '../task/TaskForm';
import { useTask } from '@/lib/hooks/useTask';

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
  boardId: string;
  onTaskCreated?: () => void;
}

export function AddTaskModal({
  isOpen,
  onClose,
  boardId,
  onTaskCreated,
}: AddTaskModalProps) {
  const { createTaskByStatus, loading } = useTask();
  const [selectedStatus, setSelectedStatus] = useState<'todo' | 'doing' | 'done'>('todo');

  useModalClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (title: string, description: string | null) => {
    await createTaskByStatus(boardId, selectedStatus, title, description);
    onTaskCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-grey rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-heading-l text-black dark:text-white mb-6">Add New Task</h2>

        <div className="mb-6">
          <label htmlFor="task-status" className="block text-body-m text-medium-grey mb-2">
            Status
          </label>
          <select
            id="task-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'todo' | 'doing' | 'done')}
            className="w-full px-4 py-2 rounded border border-medium-grey border-opacity-25 bg-white dark:bg-dark-grey text-black dark:text-white focus:outline-none focus:border-main-purple"
          >
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
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
