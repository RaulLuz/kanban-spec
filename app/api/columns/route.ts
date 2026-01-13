import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ColumnService } from '@/lib/services/ColumnService';

/**
 * POST /api/columns - Create a new column
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { boardId, name, color, position } = body;

    if (!boardId || !name) {
      return errorResponse(new Error('boardId and name are required'), 400);
    }

    const column = await ColumnService.createColumn(boardId, name, color, position);
    return successResponse({ column }, 201);
  } catch (error) {
    return errorResponse(error as Error);
  }
}
