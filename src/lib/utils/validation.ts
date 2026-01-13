/**
 * Validation utilities for entity validation
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateBoardName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Board name is required', 'name');
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Board name cannot be empty', 'name');
  }
  if (trimmed.length > 100) {
    throw new ValidationError('Board name must be 100 characters or less', 'name');
  }
}

export function validateColumnName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Column name is required', 'name');
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Column name cannot be empty', 'name');
  }
  if (trimmed.length > 50) {
    throw new ValidationError('Column name must be 50 characters or less', 'name');
  }
}

export function validateColor(color: string): void {
  if (!color || typeof color !== 'string') {
    throw new ValidationError('Color is required', 'color');
  }
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  if (!hexPattern.test(color)) {
    throw new ValidationError('Color must be a valid hex color code (e.g., #635FC7)', 'color');
  }
}

export function validateTaskTitle(title: string): void {
  if (!title || typeof title !== 'string') {
    throw new ValidationError('Task title is required', 'title');
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Task title cannot be empty', 'title');
  }
  if (trimmed.length > 200) {
    throw new ValidationError('Task title must be 200 characters or less', 'title');
  }
}

export function validateTaskDescription(description: string | null | undefined): void {
  if (description === null || description === undefined) {
    return; // Description is optional
  }
  if (typeof description !== 'string') {
    throw new ValidationError('Task description must be a string', 'description');
  }
  if (description.length > 5000) {
    throw new ValidationError('Task description must be 5000 characters or less', 'description');
  }
}

export function validateSubtaskTitle(title: string): void {
  if (!title || typeof title !== 'string') {
    throw new ValidationError('Subtask title is required', 'title');
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Subtask title cannot be empty', 'title');
  }
  if (trimmed.length > 200) {
    throw new ValidationError('Subtask title must be 200 characters or less', 'title');
  }
}
