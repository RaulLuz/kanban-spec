import { describe, it, expect, beforeAll } from '@jest/globals';
import { TaskService } from '@/lib/services/TaskService';
import { BoardService } from '@/lib/services/BoardService';
import { ColumnService } from '@/lib/services/ColumnService';
import { runMigrations } from '@/lib/db/migrate';

describe('Task API Integration Tests', () => {
  let boardId: string;
  let columnId: string;

  beforeAll(async () => {
    await runMigrations();
    
    // Create a test board and column
    const board = await BoardService.createBoard('Test Board');
    boardId = board.id;
    
    const columns = await ColumnService.getColumnsByBoard(boardId);
    columnId = columns[0]?.id || '';
  });

  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const task = await TaskService.createTask(columnId, boardId, 'Test Task', 'Test description');
      
      expect(task).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test description');
      expect(task.columnId).toBe(columnId);
    });

    it('should create a task without description', async () => {
      const task = await TaskService.createTask(columnId, boardId, 'Task Without Description');
      
      expect(task).toBeDefined();
      expect(task.title).toBe('Task Without Description');
      expect(task.description).toBeNull();
    });
  });

  describe('GET /api/tasks/[id]', () => {
    it('should return a task by id', async () => {
      const created = await TaskService.createTask(columnId, boardId, 'Get Test Task');
      const task = await TaskService.getTask(created.id);
      
      expect(task).toBeDefined();
      expect(task?.id).toBe(created.id);
      expect(task?.title).toBe('Get Test Task');
    });
  });

  describe('Task status derivation', () => {
    it('should derive status from column name', async () => {
      const task = await TaskService.createTask(columnId, boardId, 'Status Test Task');
      const retrieved = await TaskService.getTask(task.id);
      
      expect(retrieved?.status).toBeDefined();
      // Status should be derived from column name (todo, doing, or done)
      expect(['todo', 'doing', 'done']).toContain(retrieved?.status);
    });
  });
});
