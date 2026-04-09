/**
 * Validation utility functions
 */

/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Password validation
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
};

/**
 * Display name validation
 */
export const validateDisplayName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

/**
 * Check password strength
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  return 'strong';
};

/**
 * URL validation
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Number validation
 */
export const validateNumber = (
  value: any,
  min?: number,
  max?: number
): boolean => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

/**
 * File size validation
 */
export const validateFileSize = (fileSizeInBytes: number, maxSizeMB: number): boolean => {
  return fileSizeInBytes <= maxSizeMB * 1024 * 1024;
};

/**
 * Phone number validation
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Username validation
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

export default {
  validateEmail,
  validatePassword,
  validateDisplayName,
  getPasswordStrength,
  validateUrl,
  validateNumber,
  validateFileSize,
  validatePhoneNumber,
  validateUsername,
};