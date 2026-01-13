/**
 * Design tokens extracted from Figma design system
 */

export const colors = {
  // Primary
  mainPurple: '#635FC7',
  mainPurpleHover: '#A8A4FF',
  
  // Accent
  red: '#EA5555',
  redHover: '#FF9898',
  
  // Neutral - Light Mode
  black: '#000112',
  white: '#FFFFFF',
  lightGrey: '#F4F7FD',
  linesLight: '#E4EBFA',
  mediumGrey: '#828FA3',
  
  // Neutral - Dark Mode
  veryDarkGrey: '#20212C',
  darkGrey: '#2B2C37',
  linesDark: '#3E3F4E',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Plus Jakarta Sans', 'sans-serif'],
  },
  fontSize: {
    headingXL: { size: '24px', lineHeight: '100%', fontWeight: 700 },
    headingL: { size: '18px', lineHeight: '100%', fontWeight: 700 },
    headingM: { size: '15px', lineHeight: '100%', fontWeight: 700 },
    headingS: { size: '12px', lineHeight: '100%', fontWeight: 700, letterSpacing: '2.4px' },
    bodyL: { size: '13px', lineHeight: '177%', fontWeight: 500 },
    bodyM: { size: '12px', lineHeight: '100%', fontWeight: 700 },
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;
