import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { TaskService } from '@/lib/services/TaskService';

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { columnId, boardId, title, description } = body;

    if (!columnId || !boardId || !title) {
      return errorResponse(new Error('columnId, boardId, and title are required'), 400);
    }

    const task = await TaskService.createTask(columnId, boardId, title, description || null);
    return successResponse({ task }, 201);
  } catch (error) {
    return errorResponse(error as Error);
  }
}
