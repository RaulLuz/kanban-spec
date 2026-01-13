import { db } from '../db';
import { themePreferences } from '../db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_THEME } from '../utils/constants';
import { StorageError } from '../utils/errors';
import type { Theme } from '@/types';

export class ThemeService {
  /**
   * Get current theme preference
   */
  static async getTheme(): Promise<Theme> {
    try {
      const result = await db
        .select()
        .from(themePreferences)
        .where(eq(themePreferences.id, 'default'))
        .limit(1);

      if (result.length === 0) {
        // Create default theme preference
        await this.setTheme(DEFAULT_THEME);
        return DEFAULT_THEME;
      }

      return result[0].theme as Theme;
    } catch (error) {
      throw new StorageError('Failed to retrieve theme', error as Error);
    }
  }

  /**
   * Set theme preference
   */
  static async setTheme(theme: Theme): Promise<Theme> {
    try {
      const now = new Date();

      // Check if preference exists
      const existing = await db
        .select()
        .from(themePreferences)
        .where(eq(themePreferences.id, 'default'))
        .limit(1);

      if (existing.length === 0) {
        // Create new preference
        await db.insert(themePreferences).values({
          id: 'default',
          theme,
          updatedAt: now,
        });
      } else {
        // Update existing preference
        await db
          .update(themePreferences)
          .set({
            theme,
            updatedAt: now,
          })
          .where(eq(themePreferences.id, 'default'));
      }

      return theme;
    } catch (error) {
      throw new StorageError('Failed to save theme', error as Error);
    }
  }

  /**
   * Toggle theme between light and dark
   */
  static async toggleTheme(): Promise<Theme> {
    try {
      const currentTheme = await this.getTheme();
      const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
      return await this.setTheme(newTheme);
    } catch (error) {
      throw new StorageError('Failed to toggle theme', error as Error);
    }
  }
}
