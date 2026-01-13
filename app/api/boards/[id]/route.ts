import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { BoardService } from '@/lib/services/BoardService';

/**
 * GET /api/boards/[id] - Get a single board
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const board = await BoardService.getBoard(id);
    
    if (!board) {
      return errorResponse(new Error('Board not found'), 404);
    }

    return successResponse({ board });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * PATCH /api/boards/[id] - Update a board
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    const updates: Partial<{ name: string }> = {};
    if (name !== undefined) {
      updates.name = name;
    }

    const board = await BoardService.updateBoard(id, updates);
    return successResponse({ board });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * DELETE /api/boards/[id] - Delete a board
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await BoardService.deleteBoard(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
