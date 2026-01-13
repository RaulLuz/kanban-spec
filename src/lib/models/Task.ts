import { validateTaskTitle, validateTaskDescription } from '../utils/validation';
import type { Task } from '@/types';

/**
 * Task domain model with validation
 */
export class TaskModel {
  constructor(
    public id: string,
    public columnId: string,
    public boardId: string,
    public title: string,
    public description: string | null,
    public position: number,
    public createdAt: Date,
    public updatedAt: Date,
    public status?: 'todo' | 'doing' | 'done'
  ) {
    this.validate();
  }

  private validate(): void {
    validateTaskTitle(this.title);
    validateTaskDescription(this.description);
    if (this.position < 0) {
      throw new Error('Position must be non-negative');
    }
  }

  static fromData(data: Task): TaskModel {
    return new TaskModel(
      data.id,
      data.columnId,
      data.boardId,
      data.title,
      data.description ?? null,
      data.position,
      data.createdAt,
      data.updatedAt,
      data.status
    );
  }

  toData(): Task {
    return {
      id: this.id,
      columnId: this.columnId,
      boardId: this.boardId,
      title: this.title,
      description: this.description,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
    };
  }
}
