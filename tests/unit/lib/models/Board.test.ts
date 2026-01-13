import { describe, it, expect } from '@jest/globals';
import { BoardModel } from '@/lib/models/Board';
import { ValidationError } from '@/lib/utils/validation';

describe('BoardModel', () => {
  const validBoardData = {
    id: 'board-1',
    name: 'Test Board',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid board', () => {
    const board = new BoardModel(
      validBoardData.id,
      validBoardData.name,
      validBoardData.createdAt,
      validBoardData.updatedAt
    );

    expect(board.id).toBe(validBoardData.id);
    expect(board.name).toBe(validBoardData.name);
  });

  it('should throw ValidationError for empty name', () => {
    expect(() => {
      new BoardModel('board-1', '', new Date(), new Date());
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for name longer than 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() => {
      new BoardModel('board-1', longName, new Date(), new Date());
    }).toThrow(ValidationError);
  });

  it('should convert to data object', () => {
    const board = new BoardModel(
      validBoardData.id,
      validBoardData.name,
      validBoardData.createdAt,
      validBoardData.updatedAt
    );

    const data = board.toData();
    expect(data).toEqual(validBoardData);
  });

  it('should create from data object', () => {
    const board = BoardModel.fromData(validBoardData);
    expect(board.id).toBe(validBoardData.id);
    expect(board.name).toBe(validBoardData.name);
  });
});
