import { getStorageData, saveStorageData } from '../storage/localStorage';
import { DEFAULT_THEME } from '../utils/constants';
import { StorageError } from '../utils/errors';
import type { Theme } from '@/types';

export class ThemeService {
  /**
   * Get current theme preference
   */
  static async getTheme(): Promise<Theme> {
    try {
      const data = getStorageData();

      if (!data.theme) {
        // Create default theme preference
        await this.setTheme(DEFAULT_THEME);
        return DEFAULT_THEME;
      }

      return data.theme.theme;
    } catch (error) {
      throw new StorageError('Failed to retrieve theme', error as Error);
    }
  }

  /**
   * Set theme preference
   */
  static async setTheme(theme: Theme): Promise<Theme> {
    try {
      const data = getStorageData();
      data.theme = {
        theme,
        updatedAt: new Date().toISOString(),
      };
      saveStorageData(data);

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
