import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ThemeService } from '@/lib/services/ThemeService';

/**
 * GET /api/theme - Get current theme preference
 */
export async function GET() {
  try {
    const theme = await ThemeService.getTheme();
    return successResponse({ theme });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * PATCH /api/theme - Update theme preference
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    if (!theme || (theme !== 'light' && theme !== 'dark')) {
      return errorResponse(new Error('Theme must be "light" or "dark"'), 400);
    }

    const updatedTheme = await ThemeService.setTheme(theme);
    return successResponse({ theme: updatedTheme });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * POST /api/theme/toggle - Toggle theme between light and dark
 */
export async function POST() {
  try {
    const theme = await ThemeService.toggleTheme();
    return successResponse({ theme });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
