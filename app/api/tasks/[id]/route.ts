import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { TaskService } from '@/lib/services/TaskService';

/**
 * GET /api/tasks/[id] - Get a single task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await TaskService.getTask(id);

    if (!task) {
      return errorResponse(new Error('Task not found'), 404);
    }

    return successResponse({ task });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * PATCH /api/tasks/[id] - Update a task
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, columnId } = body;

    const updates: Partial<{ title: string; description: string | null; columnId: string }> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (columnId !== undefined) updates.columnId = columnId;

    const task = await TaskService.updateTask(id, updates);
    return successResponse({ task });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * DELETE /api/tasks/[id] - Delete a task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await TaskService.deleteTask(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
