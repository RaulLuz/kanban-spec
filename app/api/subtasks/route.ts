import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { SubtaskService } from '@/lib/services/SubtaskService';

/**
 * POST /api/subtasks - Create a new subtask
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, title } = body;

    if (!taskId || !title) {
      return errorResponse(new Error('taskId and title are required'), 400);
    }

    const subtask = await SubtaskService.createSubtask(taskId, title);
    return successResponse({ subtask }, 201);
  } catch (error) {
    return errorResponse(error as Error);
  }
}
