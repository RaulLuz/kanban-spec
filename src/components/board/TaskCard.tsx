'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect, memo } from 'react';
import type { Task, Subtask } from '@/types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

/**
 * TaskCard component - displays a task summary in a column
 * Shows task title and subtask completion progress
 */
export const TaskCard = memo(function TaskCard({ task, onClick }: TaskCardProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const response = await fetch(`/api/tasks/${task.id}/subtasks`);
        if (response.ok) {
          const data = await response.json();
          setSubtasks(data.subtasks || []);
        }
      } catch (error) {
        console.error('Failed to fetch subtasks:', error);
      }
    };

    fetchSubtasks();
  }, [task.id]);

  const subtaskCount = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.isCompleted).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. ${subtaskCount > 0 ? `${completedSubtasks} of ${subtaskCount} subtasks completed.` : 'No subtasks.'} Click to view details.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="bg-white dark:bg-dark-grey rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-main-purple"
    >
      <h4 
        className="text-heading-m text-black dark:text-white mb-2 truncate"
        title={task.title.length > 50 ? task.title : undefined}
      >
        {task.title.length > 50 ? `${task.title.substring(0, 50)}...` : task.title}
      </h4>
      {subtaskCount > 0 && (
        <p className="text-body-m text-medium-grey">
          {completedSubtasks} of {subtaskCount} subtasks
        </p>
      )}
    </div>
  );
});
