import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { TaskService } from '@/lib/services/TaskService';

/**
 * GET /api/boards/[id]/tasks - Get all tasks for a board
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tasks = await TaskService.getTasksByBoard(id);
    return successResponse({ tasks });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
