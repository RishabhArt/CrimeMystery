/**
 * Application-wide constants
 */

// ============ APP INFO ============
export const APP_NAME = 'Crime Mystery Detective';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'Detective Studios';

// ============ API CONFIGURATION ============
export const API_CONFIG = {
  TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000'),
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// ============ CACHE CONFIGURATION ============
export const CACHE_CONFIG = {
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  CASE_LIST: 10 * 60 * 1000, // 10 minutes
  LEADERBOARD: 2 * 60 * 1000, // 2 minutes
  PUZZLE_DATA: 30 * 60 * 1000, // 30 minutes
};

// ============ GAMEPLAY CONFIGURATION ============
export const GAMEPLAY_CONFIG = {
  FREE_CLUES_PER_DAY: 3,
  FREE_CLUES_RESET_HOUR: 0,
  MAX_LEVEL: 500,
  XP_PER_LEVEL: 1000,
  DIFFICULTY_XP_MULTIPLIERS: {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 2.5,
  },
  SPEED_BONUS_THRESHOLD: 300, // 5 minutes
  SPEED_BONUS_MULTIPLIER: 1.2,
};

// ============ MONETIZATION CONFIGURATION ============
export const MONETIZATION_CONFIG = {
  CLUE_PACKS: [
    { id: 'clues_5', clues: 5, price: 30, displayPrice: '₹30' },
    { id: 'clues_15', clues: 15, price: 99, displayPrice: '₹99', discount: '20%' },
    { id: 'clues_50', clues: 50, price: 299, displayPrice: '₹299', discount: '40%' },
  ],
  PREMIUM_TIERS: {
    monthly: { id: 'premium_monthly', price: 499, displayPrice: '₹499/month', days: 30 },
    quarterly: { id: 'premium_quarterly', price: 1299, displayPrice: '₹1,299', days: 90 },
    yearly: { id: 'premium_yearly', price: 4299, displayPrice: '₹4,299', days: 365 },
  },
  CURRENCY: 'INR',
};

// ============ DIFFICULTY LEVELS ============
export const DIFFICULTY_LEVELS = {
  easy: {
    minLevel: 1,
    maxLevel: 4,
    xpMultiplier: 1.0,
    timeLimit: 600, // 10 minutes
  },
  medium: {
    minLevel: 5,
    maxLevel: 14,
    xpMultiplier: 1.5,
    timeLimit: 300, // 5 minutes
  },
  hard: {
    minLevel: 15,
    maxLevel: 29,
    xpMultiplier: 2.0,
    timeLimit: 180, // 3 minutes
  },
  expert: {
    minLevel: 30,
    maxLevel: 999,
    xpMultiplier: 2.5,
    timeLimit: 120, // 2 minutes
  },
};

// ============ ANALYTICS EVENTS ============
export const ANALYTICS_EVENTS = {
  APP_LAUNCHED: 'app_launched',
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  CASE_STARTED: 'case_started',
  CASE_COMPLETED: 'case_completed',
  PUZZLE_SOLVED: 'puzzle_solved',
  PUZZLE_FAILED: 'puzzle_failed',
  CLUE_USED: 'clue_used',
  PURCHASE_COMPLETED: 'purchase_completed',
  LEVEL_UP: 'level_up',
};

// ============ ERROR CODES ============
export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_EMAIL: 'auth/invalid-email',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_WRONG_PASSWORD: 'auth/wrong-password',
  AUTH_EMAIL_IN_USE: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_SESSION_EXPIRED: 'auth/session-expired',
  // Database
  DB_PERMISSION_DENIED: 'db/permission-denied',
  DB_NOT_FOUND: 'db/not-found',
  DB_CONFLICT: 'db/conflict',
  // Network
  NETWORK_ERROR: 'network/error',
  NETWORK_TIMEOUT: 'network/timeout',
  // App
  APP_UNKNOWN_ERROR: 'app/unknown',
};

// ============ STORAGE KEYS ============
export const STORAGE_KEYS = {
  AUTH_USER: '@crime_mystery_auth_user',
  USER_PREFERENCES: '@crime_mystery_user_preferences',
  GAME_STATE: '@crime_mystery_game_state',
  SESSION_ID: '@crime_mystery_session_id',
  LAST_SYNC: '@crime_mystery_last_sync',
};

// ============ FEATURE FLAGS ============
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_CRASH_REPORTING: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true',
  ENABLE_OFFLINE_MODE: true,
  MAINTENANCE_MODE: false,
};

// ============ RATE LIMITS ============
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MINUTES: 15,
};

// ============ PAGINATION ============
export const PAGINATION = {
  CASES_PER_PAGE: 20,
  LEADERBOARD_LIMIT: 100,
};

// ============ TIMEOUTS ============
export const TIMEOUTS = {
  SESSION_INACTIVITY_MINUTES: 30,
  MAX_SESSION_DURATION_MINUTES: 8 * 60,
};