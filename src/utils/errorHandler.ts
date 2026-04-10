/**
 * Error handling and logging utility
 */

import { ERROR_CODES } from '../constants';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AppErrorOptions {
  code?: string;
  severity?: ErrorSeverity;
  context?: Record<string, any>;
  originalError?: Error;
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  public code: string;
  public severity: ErrorSeverity;
  public context: Record<string, any>;
  public timestamp: Date;

  constructor(
    message: string,
    options: AppErrorOptions = {}
  ) {
    super(message);
    this.code = options.code || ERROR_CODES.APP_UNKNOWN_ERROR;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.context = options.context || {};
    this.timestamp = new Date();

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Convert to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Error logger
 */
export const logError = (error: any, context?: Record<string, any>) => {
  const errorObj = error instanceof AppError ? error : new AppError(error.message || String(error), { context });

  console.error('[ERROR]', {
    code: errorObj.code,
    message: errorObj.message,
    severity: errorObj.severity,
    context: { ...errorObj.context, ...context },
    timestamp: errorObj.timestamp,
    stack: errorObj.stack,
  });

  // In production, send to error tracking service
  if (process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true') {
    // TODO: Send to Sentry or similar
  }
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: any): string => {
  if (error instanceof AppError) {
    switch (error.code) {
      case ERROR_CODES.AUTH_INVALID_EMAIL:
        return 'Please enter a valid email address.';
      case ERROR_CODES.AUTH_USER_NOT_FOUND:
        return 'Email not found. Please sign up first.';
      case ERROR_CODES.AUTH_WRONG_PASSWORD:
        return 'Incorrect password. Please try again.';
      case ERROR_CODES.AUTH_EMAIL_IN_USE:
        return 'This email is already registered.';
      case ERROR_CODES.AUTH_WEAK_PASSWORD:
        return 'Password must be at least 8 characters with uppercase, lowercase, and numbers.';
      case ERROR_CODES.AUTH_SESSION_EXPIRED:
        return 'Your session has expired. Please login again.';
      case ERROR_CODES.DB_PERMISSION_DENIED:
        return 'You do not have permission to access this resource.';
      case ERROR_CODES.DB_NOT_FOUND:
        return 'The requested resource was not found.';
      case ERROR_CODES.NETWORK_ERROR:
        return 'Network connection error. Please check your internet.';
      case ERROR_CODES.NETWORK_TIMEOUT:
        return 'Request timed out. Please try again.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return error?.message || 'An unexpected error occurred.';
};

/**
 * Handle async operations with error handling
 */
export const handleAsync = async <T>(
  promise: Promise<T>,
  errorMessage?: string
): Promise<[T | null, AppError | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error: any) {
    const appError = error instanceof AppError
      ? error
      : new AppError(errorMessage || error.message || 'Unknown error', {
        code: error.code || ERROR_CODES.APP_UNKNOWN_ERROR,
        originalError: error,
      });

    logError(appError);
    return [null, appError];
  }
};

export default {
  AppError,
  ErrorSeverity,
  logError,
  getUserFriendlyMessage,
  handleAsync,
};