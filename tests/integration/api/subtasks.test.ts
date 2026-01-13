import { describe, it, expect, beforeAll } from '@jest/globals';
import { SubtaskService } from '@/lib/services/SubtaskService';
import { TaskService } from '@/lib/services/TaskService';
import { BoardService } from '@/lib/services/BoardService';
import { ColumnService } from '@/lib/services/ColumnService';
import { runMigrations } from '@/lib/db/migrate';

describe('Subtask API Integration Tests', () => {
  let boardId: string;
  let columnId: string;
  let taskId: string;

  beforeAll(async () => {
    await runMigrations();
    
    const board = await BoardService.createBoard('Test Board');
    boardId = board.id;
    
    const columns = await ColumnService.getColumnsByBoard(boardId);
    columnId = columns[0]?.id || '';
    
    const task = await TaskService.createTask(columnId, boardId, 'Test Task');
    taskId = task.id;
  });

  describe('POST /api/subtasks', () => {
    it('should create a subtask successfully', async () => {
      const subtask = await SubtaskService.createSubtask(taskId, 'Test Subtask');
      
      expect(subtask).toBeDefined();
      expect(subtask.title).toBe('Test Subtask');
      expect(subtask.taskId).toBe(taskId);
      expect(subtask.isCompleted).toBe(false);
    });
  });

  describe('PATCH /api/subtasks/[id]', () => {
    it('should update subtask completion status', async () => {
      const subtask = await SubtaskService.createSubtask(taskId, 'Toggle Test Subtask');
      
      const updated = await SubtaskService.updateSubtask(subtask.id, { isCompleted: true });
      expect(updated.isCompleted).toBe(true);
    });

    it('should toggle subtask completion', async () => {
      const subtask = await SubtaskService.createSubtask(taskId, 'Toggle Test');
      
      const toggled = await SubtaskService.toggleSubtask(subtask.id);
      expect(toggled.isCompleted).toBe(true);
      
      const toggledAgain = await SubtaskService.toggleSubtask(subtask.id);
      expect(toggledAgain.isCompleted).toBe(false);
    });
  });

  describe('GET /api/subtasks by task', () => {
    it('should return all subtasks for a task', async () => {
      await SubtaskService.createSubtask(taskId, 'Subtask 1');
      await SubtaskService.createSubtask(taskId, 'Subtask 2');
      
      const subtasks = await SubtaskService.getSubtasksByTask(taskId);
      expect(subtasks.length).toBeGreaterThanOrEqual(2);
    });
  });
});
