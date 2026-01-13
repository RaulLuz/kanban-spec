import { validateColumnName, validateColor } from '../utils/validation';
import type { Column } from '@/types';

/**
 * Column domain model with validation
 */
export class ColumnModel {
  constructor(
    public id: string,
    public boardId: string,
    public name: string,
    public color: string,
    public position: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    validateColumnName(this.name);
    validateColor(this.color);
    if (this.position < 0) {
      throw new Error('Position must be non-negative');
    }
  }

  static fromData(data: Column): ColumnModel {
    return new ColumnModel(
      data.id,
      data.boardId,
      data.name,
      data.color,
      data.position,
      data.createdAt,
      data.updatedAt
    );
  }

  toData(): Column {
    return {
      id: this.id,
      boardId: this.boardId,
      name: this.name,
      color: this.color,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
