import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { TaskService } from '@/lib/services/TaskService';

/**
 * POST /api/tasks/move - Move a task to a different column and position
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, targetColumnId, newPosition } = body;

    if (!taskId || targetColumnId === undefined || newPosition === undefined) {
      return errorResponse(
        new Error('taskId, targetColumnId, and newPosition are required'),
        400
      );
    }

    const task = await TaskService.moveTask(taskId, targetColumnId, Number(newPosition));
    return successResponse({ task });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
