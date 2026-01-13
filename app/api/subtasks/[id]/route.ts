import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { SubtaskService } from '@/lib/services/SubtaskService';

/**
 * GET /api/subtasks/[id] - Get a single subtask
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtask = await SubtaskService.getSubtask(id);

    if (!subtask) {
      return errorResponse(new Error('Subtask not found'), 404);
    }

    return successResponse({ subtask });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

  /**
   * PATCH /api/subtasks/[id] - Update a subtask
   */
  export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const body = await request.json();
      const { title, isCompleted, toggle } = body;

      // Handle toggle
      if (toggle) {
        const subtask = await SubtaskService.toggleSubtask(id);
        return successResponse({ subtask });
      }

      const updates: Partial<{ title: string; isCompleted: boolean }> = {};
      if (title !== undefined) updates.title = title;
      if (isCompleted !== undefined) updates.isCompleted = isCompleted;

      const subtask = await SubtaskService.updateSubtask(id, updates);
      return successResponse({ subtask });
    } catch (error) {
      return errorResponse(error as Error);
    }
  }

/**
 * DELETE /api/subtasks/[id] - Delete a subtask
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await SubtaskService.deleteSubtask(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
