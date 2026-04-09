/**
 * Color Theme & Design System
 */

export const COLORS = {
  // Primary Colors
  PRIMARY: '#2A3F8E',      // Deep Blue
  PRIMARY_LIGHT: '#E8EEFB', // Light Blue
  PRIMARY_DARK: '#1a2555',  // Dark Blue

  // Secondary Colors
  SECONDARY: '#F4A300',     // Gold
  SECONDARY_LIGHT: '#FCD34D', // Light Gold
  SECONDARY_DARK: '#B87600', // Dark Gold

  // Accent Colors
  ACCENT: '#E94B3C',        // Red
  ACCENT_LIGHT: '#FEE2E2',  // Light Red
  ACCENT_DARK: '#991B1B',   // Dark Red

  // Neutral Colors
  BACKGROUND: '#F5F5F5',    // Light Gray
  SURFACE: '#FFFFFF',       // White
  TEXT_PRIMARY: '#1A1A1A',  // Dark Gray
  TEXT_SECONDARY: '#757575', // Medium Gray
  TEXT_TERTIARY: '#999999', // Light Gray

  // Semantic Colors
  SUCCESS: '#27AE60',       // Green
  SUCCESS_LIGHT: '#DCFCE7', // Light Green
  WARNING: '#E74C3C',       // Red/Warning
  WARNING_LIGHT: '#FEE2E2', // Light Red
  ERROR: '#C62828',         // Deep Red
  ERROR_LIGHT: '#FFEBEE',   // Light Red
  INFO: '#1976D2',          // Blue
  INFO_LIGHT: '#E3F2FD',    // Light Blue

  // Utility Colors
  DISABLED: '#BDBDBD',      // Disabled
  DIVIDER: '#E0E0E0',       // Border
  TRANSPARENT: 'transparent',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',

  // Gradient Colors (for future use)
  GRADIENT_START: '#2A3F8E',
  GRADIENT_END: '#F4A300',
};

/**
 * Typography Configuration
 */
export const TYPOGRAPHY = {
  H1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  H2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  H3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  H4: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  BODY: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  BODY_SMALL: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  BUTTON: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  CAPTION: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  OVERLINE: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
};

/**
 * Spacing Configuration
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

/**
 * Border Radius Configuration
 */
export const BORDER_RADIUS = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

/**
 * Shadows Configuration
 */
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
};