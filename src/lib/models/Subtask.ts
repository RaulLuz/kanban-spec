import { validateSubtaskTitle } from '../utils/validation';
import type { Subtask } from '@/types';

/**
 * Subtask domain model with validation
 */
export class SubtaskModel {
  constructor(
    public id: string,
    public taskId: string,
    public title: string,
    public isCompleted: boolean,
    public position: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    validateSubtaskTitle(this.title);
    if (this.position < 0) {
      throw new Error('Position must be non-negative');
    }
  }

  static fromData(data: Subtask): SubtaskModel {
    return new SubtaskModel(
      data.id,
      data.taskId,
      data.title,
      data.isCompleted,
      data.position,
      data.createdAt,
      data.updatedAt
    );
  }

  toData(): Subtask {
    return {
      id: this.id,
      taskId: this.taskId,
      title: this.title,
      isCompleted: this.isCompleted,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
