'use client';

import { useBoardContext } from '@/components/providers/BoardProvider';
import { BoardView } from '@/components/board/BoardView';
import { ViewTaskModal } from '@/components/modals/ViewTaskModal';
import { AddTaskModal } from '@/components/modals/AddTaskModal';
import { EditTaskModal } from '@/components/modals/EditTaskModal';
import { EditColumnModal } from '@/components/modals/EditColumnModal';
import { EmptyState } from '@/components/board/EmptyState';
import { useColumn } from '@/lib/hooks/useColumn';
import { useBoardTasks } from '@/lib/hooks/useBoardTasks';
import { useTask } from '@/lib/hooks/useTask';
import { useState } from 'react';
import type { Task, Column } from '@/types';

export default function Home() {
  const { currentBoard, boards, loading: boardsLoading } = useBoardContext();
  const { columns, loading: columnsLoading, refreshColumns } = useColumn(currentBoard?.id || null);
  const { tasks, loading: tasksLoading, refreshTasks } = useBoardTasks(currentBoard?.id || null);
  const { moveTask } = useTask();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditColumnModal, setShowEditColumnModal] = useState(false);

  const loading = boardsLoading || columnsLoading || tasksLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-medium-grey">Loading...</p>
      </div>
    );
  }

  if (boards.length === 0) {
    return <EmptyState onCreateBoard={() => {}} />;
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-medium-grey">Select a board to get started</p>
      </div>
    );
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleAddTask = () => {
    setShowAddModal(true);
  };

  const handleColumnEdit = (column: Column) => {
    setSelectedColumn(column);
    setShowEditColumnModal(true);
  };

  const handleTaskMove = async (taskId: string, targetColumnId: string, newPosition: number) => {
    try {
      await moveTask(taskId, targetColumnId, newPosition);
      await refreshTasks();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const handleTaskUpdated = () => {
    refreshTasks();
    setSelectedTask(null);
  };

  const handleColumnUpdated = () => {
    refreshColumns();
    setSelectedColumn(null);
  };

  return (
    <>
      <BoardView
        columns={columns}
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        onTaskMove={handleTaskMove}
        onColumnEdit={handleColumnEdit}
      />

      {selectedTask && (
        <ViewTaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          taskId={selectedTask.id}
          columns={columns}
          onTaskUpdated={handleTaskUpdated}
          onEdit={() => {
            setShowEditModal(true);
            setSelectedTask(null);
          }}
          onDelete={async () => {
            // TODO: Implement delete
            setSelectedTask(null);
            await refreshTasks();
          }}
        />
      )}

      {showAddModal && (
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
          }}
          boardId={currentBoard.id}
          onTaskCreated={handleTaskUpdated}
        />
      )}

      {showEditModal && selectedTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          taskId={selectedTask.id}
          columns={columns}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {showEditColumnModal && selectedColumn && (
        <EditColumnModal
          isOpen={showEditColumnModal}
          onClose={() => {
            setShowEditColumnModal(false);
            setSelectedColumn(null);
          }}
          column={selectedColumn}
          onColumnUpdated={handleColumnUpdated}
        />
      )}
    </>
  );
}
