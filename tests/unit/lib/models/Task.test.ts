import { describe, it, expect } from '@jest/globals';
import { TaskModel } from '@/lib/models/Task';
import { ValidationError } from '@/lib/utils/validation';

describe('TaskModel', () => {
  const validTaskData = {
    id: 'task-1',
    columnId: 'column-1',
    boardId: 'board-1',
    title: 'Test Task',
    description: 'Test description',
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid task', () => {
    const task = new TaskModel(
      validTaskData.id,
      validTaskData.columnId,
      validTaskData.boardId,
      validTaskData.title,
      validTaskData.description,
      validTaskData.position,
      validTaskData.createdAt,
      validTaskData.updatedAt
    );

    expect(task.id).toBe(validTaskData.id);
    expect(task.title).toBe(validTaskData.title);
  });

  it('should throw ValidationError for empty title', () => {
    expect(() => {
      new TaskModel('task-1', 'column-1', 'board-1', '', null, 0, new Date(), new Date());
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for title longer than 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    expect(() => {
      new TaskModel('task-1', 'column-1', 'board-1', longTitle, null, 0, new Date(), new Date());
    }).toThrow(ValidationError);
  });

  it('should accept null description', () => {
    const task = new TaskModel(
      validTaskData.id,
      validTaskData.columnId,
      validTaskData.boardId,
      validTaskData.title,
      null,
      validTaskData.position,
      validTaskData.createdAt,
      validTaskData.updatedAt
    );

    expect(task.description).toBeNull();
  });

  it('should convert to data object', () => {
    const task = new TaskModel(
      validTaskData.id,
      validTaskData.columnId,
      validTaskData.boardId,
      validTaskData.title,
      validTaskData.description,
      validTaskData.position,
      validTaskData.createdAt,
      validTaskData.updatedAt
    );

    const data = task.toData();
    expect(data.id).toBe(validTaskData.id);
    expect(data.title).toBe(validTaskData.title);
  });
});
