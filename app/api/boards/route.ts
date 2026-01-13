import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { BoardService } from '@/lib/services/BoardService';

/**
 * GET /api/boards - List all boards
 */
export async function GET() {
  try {
    const boards = await BoardService.getAllBoards();
    return successResponse({ boards });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * POST /api/boards - Create a new board
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return errorResponse(new Error('Board name is required'), 400);
    }

    const board = await BoardService.createBoard(name);
    return successResponse({ board }, 201);
  } catch (error) {
    return errorResponse(error as Error);
  }
}
