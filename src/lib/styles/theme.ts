import type { Theme } from '@/types';

/**
 * Theme configuration for light/dark mode support
 */

export const themeConfig = {
  light: {
    background: '#F4F7FD',
    surface: '#FFFFFF',
    text: '#000112',
    textSecondary: '#828FA3',
    border: '#E4EBFA',
    primary: '#635FC7',
    primaryHover: '#A8A4FF',
    error: '#EA5555',
    errorHover: '#FF9898',
  },
  dark: {
    background: '#20212C',
    surface: '#2B2C37',
    text: '#FFFFFF',
    textSecondary: '#828FA3',
    border: '#3E3F4E',
    primary: '#635FC7',
    primaryHover: '#A8A4FF',
    error: '#EA5555',
    errorHover: '#FF9898',
  },
} as const;

export function getThemeColors(theme: Theme) {
  return themeConfig[theme];
}
