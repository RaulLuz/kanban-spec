import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { SubtaskService } from '@/lib/services/SubtaskService';

/**
 * GET /api/tasks/[id]/subtasks - Get all subtasks for a task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtasks = await SubtaskService.getSubtasksByTask(id);
    return successResponse({ subtasks });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
