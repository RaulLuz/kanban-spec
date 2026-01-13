/**
 * LocalStorage service for client-side data persistence
 * Compatible with Vercel serverless functions
 */

const STORAGE_KEY = 'kanban-data';

export interface StorageData {
  boards: Array<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
  columns: Array<{
    id: string;
    boardId: string;
    name: string;
    color: string;
    position: number;
    createdAt: string;
    updatedAt: string;
  }>;
  tasks: Array<{
    id: string;
    columnId: string;
    boardId: string;
    title: string;
    description: string | null;
    position: number;
    createdAt: string;
    updatedAt: string;
  }>;
  subtasks: Array<{
    id: string;
    taskId: string;
    title: string;
    isCompleted: boolean;
    position: number;
    createdAt: string;
    updatedAt: string;
  }>;
  theme: {
    theme: 'light' | 'dark';
    updatedAt: string;
  };
}

const defaultData: StorageData = {
  boards: [],
  columns: [],
  tasks: [],
  subtasks: [],
  theme: {
    theme: 'light',
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Get data from localStorage
 */
export function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return defaultData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultData;
  }
}

/**
 * Save data to localStorage
 */
export function saveStorageData(data: StorageData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    throw error;
  }
}

/**
 * Initialize with default board if none exists
 */
export function initializeStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const data = getStorageData();
  
  if (data.boards.length === 0) {
    const boardId = generateId();
    const now = new Date().toISOString();
    
    const newBoard = {
      id: boardId,
      name: 'My Board',
      createdAt: now,
      updatedAt: now,
    };
    
    const defaultColumns = ['Todo', 'Doing', 'Done'].map((name, index) => ({
      id: generateId(),
      boardId,
      name,
      color: '#635FC7',
      position: index,
      createdAt: now,
      updatedAt: now,
    }));
    
    data.boards.push(newBoard);
    data.columns.push(...defaultColumns);
    saveStorageData(data);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
