/**
 * Application constants
 */

export const DEFAULT_COLUMN_NAMES = ['Todo', 'Doing', 'Done'] as const;

export const DEFAULT_COLUMN_COLOR = '#635FC7';

export const DEFAULT_THEME = 'light' as const;

export const THEME_OPTIONS = ['light', 'dark'] as const;

export type Theme = typeof THEME_OPTIONS[number];
