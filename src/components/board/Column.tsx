'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { memo } from 'react';
import type { Column, Task } from '@/types';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onEdit?: (column: Column) => void;
}

/**
 * Column component - displays a column with its tasks
 * Supports drag and drop for tasks within the column
 */
export const Column = memo(function Column({ column, tasks, onTaskClick, onAddTask, onEdit }: ColumnProps) {
  const taskCount = tasks.length;
  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="min-w-[280px] flex flex-col">
      <div className="flex items-center gap-3 mb-6 group">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        <h3 className="text-heading-s text-medium-grey uppercase flex-1">
          {column.name} ({taskCount})
        </h3>
        <button
          onClick={() => onEdit?.(column)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-medium-grey hover:text-main-purple"
          aria-label={`Edit ${column.name} column`}
        >
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="fill-current">
            <path d="M11.586 1.586A2 2 0 0 0 10.172 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8.172a2 2 0 0 0 1.414-.586l4-4A2 2 0 0 0 15.586 5.586l-4 4zM2 2h8v2H2V2zm0 4h8v2H2V6zm0 4h6v2H2v-2zm10-4.586L13.586 6 12 7.586 10.414 6 12 4.414z" />
          </svg>
        </button>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAddTask(column.id)}
        aria-label={`Add new task to ${column.name} column`}
        className="w-full py-4 mt-5 rounded-lg bg-light-grey dark:bg-very-dark-grey text-heading-m text-main-purple hover:bg-main-purple hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-main-purple"
      >
        + New Task
      </button>
    </div>
  );
});
