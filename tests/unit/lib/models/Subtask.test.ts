import { describe, it, expect } from '@jest/globals';
import { SubtaskModel } from '@/lib/models/Subtask';
import { ValidationError } from '@/lib/utils/validation';

describe('SubtaskModel', () => {
  const validSubtaskData = {
    id: 'subtask-1',
    taskId: 'task-1',
    title: 'Test Subtask',
    isCompleted: false,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid subtask', () => {
    const subtask = new SubtaskModel(
      validSubtaskData.id,
      validSubtaskData.taskId,
      validSubtaskData.title,
      validSubtaskData.isCompleted,
      validSubtaskData.position,
      validSubtaskData.createdAt,
      validSubtaskData.updatedAt
    );

    expect(subtask.id).toBe(validSubtaskData.id);
    expect(subtask.title).toBe(validSubtaskData.title);
  });

  it('should throw ValidationError for empty title', () => {
    expect(() => {
      new SubtaskModel('subtask-1', 'task-1', '', false, 0, new Date(), new Date());
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for title longer than 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    expect(() => {
      new SubtaskModel('subtask-1', 'task-1', longTitle, false, 0, new Date(), new Date());
    }).toThrow(ValidationError);
  });

  it('should convert to data object', () => {
    const subtask = new SubtaskModel(
      validSubtaskData.id,
      validSubtaskData.taskId,
      validSubtaskData.title,
      validSubtaskData.isCompleted,
      validSubtaskData.position,
      validSubtaskData.createdAt,
      validSubtaskData.updatedAt
    );

    const data = subtask.toData();
    expect(data.id).toBe(validSubtaskData.id);
    expect(data.title).toBe(validSubtaskData.title);
  });
});
