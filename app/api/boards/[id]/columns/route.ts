import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ColumnService } from '@/lib/services/ColumnService';

/**
 * GET /api/boards/[id]/columns - Get all columns for a board
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const columns = await ColumnService.getColumnsByBoard(id);
    return successResponse({ columns });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
