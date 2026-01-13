import { validateBoardName } from '../utils/validation';
import type { Board } from '@/types';

/**
 * Board domain model with validation
 */
export class BoardModel {
  constructor(
    public id: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    validateBoardName(this.name);
  }

  static fromData(data: Board): BoardModel {
    return new BoardModel(
      data.id,
      data.name,
      data.createdAt,
      data.updatedAt
    );
  }

  toData(): Board {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
