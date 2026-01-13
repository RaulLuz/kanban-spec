import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ColumnService } from '@/lib/services/ColumnService';

/**
 * GET /api/columns/[id] - Get a single column
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const column = await ColumnService.getColumn(id);

    if (!column) {
      return errorResponse(new Error('Column not found'), 404);
    }

    return successResponse({ column });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * PATCH /api/columns/[id] - Update a column
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, color, position } = body;

    const updates: Partial<{ name: string; color: string; position: number }> = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (position !== undefined) updates.position = position;

    const column = await ColumnService.updateColumn(id, updates);
    return successResponse({ column });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * DELETE /api/columns/[id] - Delete a column
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ColumnService.deleteColumn(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
