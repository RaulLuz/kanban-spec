'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Column } from './Column';
import type { Column as ColumnType, Task } from '@/types';

interface BoardViewProps {
  columns: ColumnType[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onTaskMove?: (taskId: string, targetColumnId: string, newPosition: number) => void;
  onColumnEdit?: (column: ColumnType) => void;
}

export function BoardView({
  columns,
  tasks,
  onTaskClick,
  onAddTask,
  onTaskMove,
  onColumnEdit,
}: BoardViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      // Drag cancelled - task returns to original position
      return;
    }

    const activeTask = active.data.current?.task as Task | undefined;
    if (!activeTask) return;

    // Find the column ID we're dropping into
    let targetColumnId: string | null = null;
    let newPosition = 0;

    // Check if dropped on a column
    const targetColumn = columns.find((c) => c.id === over.id);
    if (targetColumn) {
      targetColumnId = targetColumn.id;
      const columnTasks = tasks.filter((t) => t.columnId === targetColumnId);
      newPosition = columnTasks.length;
    } else {
      // Dropped on a task - use that task's column
      const overTask = over.data.current?.task as Task | undefined;
      if (overTask) {
        targetColumnId = overTask.columnId;
        const columnTasks = tasks.filter((t) => t.columnId === targetColumnId);
        const overIndex = columnTasks.findIndex((t) => t.id === overTask.id);
        newPosition = overIndex >= 0 ? overIndex : columnTasks.length;
      }
    }

    // Validate column exists
    if (!targetColumnId || !columns.find((c) => c.id === targetColumnId)) {
      console.error('Invalid target column');
      return;
    }

    // Only move if column changed or position changed
    if (targetColumnId !== activeTask.columnId && onTaskMove) {
      try {
        await onTaskMove(activeTask.id, targetColumnId, newPosition);
      } catch (error) {
        console.error('Failed to move task:', error);
      }
    }
  };

  // Group tasks by column
  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.columnId === column.id);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 overflow-x-auto h-full">
        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id] || []}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask}
              onEdit={onColumnEdit}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div 
            className="bg-white dark:bg-dark-grey rounded-lg p-4 shadow-lg opacity-90 transform rotate-2"
            role="status"
            aria-label={`Dragging task: ${activeTask.title}`}
          >
            <h4 className="text-heading-m text-black dark:text-white">
              {activeTask.title}
            </h4>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
