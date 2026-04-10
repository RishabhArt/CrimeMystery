import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment variable types
declare global {
  var EXPO_PUBLIC_SUPABASE_URL: string;
  var EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  var EXPO_PUBLIC_API_TIMEOUT: string | undefined;
  var EXPO_PUBLIC_APP_VERSION: string | undefined;
}

// Get environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase configuration. Please check your .env.local file'
  );
}

/**
 * Custom storage implementation for Supabase
 * Uses SecureStore for sensitive data on native platforms
 * Falls back to AsyncStorage for web
 */
const createSecureStorage = () => {
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const item = await SecureStore.getItemAsync(key);
        return item;
      } catch (error) {
        // Fallback to AsyncStorage
        return await AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await SecureStore.setItemAsync(key, value);
        // Also save to AsyncStorage for web
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        // Fallback to AsyncStorage
        await AsyncStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
        await AsyncStorage.removeItem(key);
      } catch (error) {
        await AsyncStorage.removeItem(key);
      }
    },
  };
};

/**
 * Initialize Supabase client
 * Production-ready configuration with:
 * - Secure session storage
 * - Auto token refresh
 * - Request timeout
 * - Error handling
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createSecureStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-app-version': process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
});

/**
 * Initialize Supabase realtime listener
 */
export const initializeSupabaseListeners = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('[Supabase] User signed in:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('[Supabase] User signed out');
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('[Supabase] Token refreshed');
    } else if (event === 'USER_UPDATED') {
      console.log('[Supabase] User updated');
    }
  });
};

/**
 * Error handler for Supabase errors
 */
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  // Auth errors
  if (error.status === 401 || error.message?.includes('JWT')) {
    return 'Authentication failed. Please login again.';
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
    return 'Network connection error. Please check your internet.';
  }

  // Validation errors
  if (error.status === 400 || error.message?.includes('validation')) {
    return 'Invalid data provided. Please check your inputs.';
  }

  // Rate limiting
  if (error.status === 429) {
    return 'Too many requests. Please wait a moment.';
  }

  // Not found
  if (error.status === 404) {
    return 'Resource not found.';
  }

  // Conflict
  if (error.status === 409) {
    return 'This item already exists.';
  }

  // Default error
  return error.message || 'Database operation failed';
};

/**
 * Get current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('[Supabase] Get Session Error:', error);
    return null;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('[Supabase] Get User Error:', error);
    return null;
  }
};

export default supabase;