'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string | null) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function TaskForm({
  initialTitle = '',
  initialDescription = '',
  onSubmit,
  onCancel,
  submitLabel = 'Create Task',
  loading = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (title.trim().length > 200) {
      setError('Task title must be 200 characters or less');
      return;
    }

    try {
      await onSubmit(title.trim(), description.trim() || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="task-title" className="block text-body-m text-medium-grey mb-2">
          Title
        </label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="e.g. Take coffee break"
          error={error || undefined}
          required
        />
      </div>

      <div>
        <label htmlFor="task-description" className="block text-body-m text-medium-grey mb-2">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          rows={4}
          className="w-full px-4 py-2 rounded border border-medium-grey border-opacity-25 bg-white dark:bg-dark-grey text-black dark:text-white placeholder:text-medium-grey focus:outline-none focus:border-main-purple resize-none"
        />
      </div>

      {error && (
        <p className="text-red text-body-m">{error}</p>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
