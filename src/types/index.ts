/**
 * TypeScript type definitions for domain entities
 */

export type Board = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Column = {
  id: string;
  boardId: string;
  name: string;
  color: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  status?: 'todo' | 'doing' | 'done'; // Derived from column name
};

export type Subtask = {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Theme = 'light' | 'dark';

export type ThemePreference = {
  id: string;
  theme: Theme;
  updatedAt: Date;
};
