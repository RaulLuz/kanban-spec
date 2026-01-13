import { db } from './index';
import { boards, columns } from './schema';
import { generateId } from '../utils/uuid';
import { DEFAULT_COLUMN_NAMES, DEFAULT_COLUMN_COLOR } from '../utils/constants';

/**
 * Initialize database with default board if none exists
 */
export async function initializeDatabase() {
  try {
    // Check if any boards exist
    const existingBoards = await db.select().from(boards).limit(1);
    
    if (existingBoards.length === 0) {
      // Create default board
      const boardId = generateId();
      const now = new Date();
      
      await db.insert(boards).values({
        id: boardId,
        name: 'My Board',
        createdAt: now,
        updatedAt: now,
      });
      
      // Create default columns
      const columnValues = DEFAULT_COLUMN_NAMES.map((name, index) => ({
        id: generateId(),
        boardId,
        name,
        color: DEFAULT_COLUMN_COLOR,
        position: index,
        createdAt: now,
        updatedAt: now,
      }));
      
      await db.insert(columns).values(columnValues);
      
      console.log('Default board created successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
