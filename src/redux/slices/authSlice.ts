import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase, handleSupabaseError } from '../../config/supabase';
import { AuthUser, User, ApiResponse } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, ERROR_CODES } from '../../constants';
import { validateEmail, validatePassword } from '../../utils/validators';

/**
 * Convert Supabase User to AuthUser
 */
const convertToAuthUser = (supabaseUser: any): AuthUser => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    user_metadata: supabaseUser.user_metadata || {},
    app_metadata: supabaseUser.app_metadata || {},
    created_at: supabaseUser.created_at,
    last_sign_in_at: supabaseUser.last_sign_in_at,
  };
};

interface AuthState {
  user: AuthUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userProfile: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

/**
 * Sign up with email async thunk
 */
export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (
    { email, password, displayName }: { email: string; password: string; displayName: string },
    { rejectWithValue }
  ) => {
    try {
      // Validation
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      }
      if (displayName.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }

      // Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new Error(handleSupabaseError(authError));
      if (!authData.user) throw new Error('User creation failed');

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: authData.user.id,
            email,
            display_name: displayName.trim(),
            level: 1,
            total_xp: 0,
            total_clues_owned: 0,
            free_clues_remaining: 3,
            last_clue_reset: new Date().toISOString(),
            total_spent_amount: 0,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (profileError) {
        // Rollback auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(handleSupabaseError(profileError));
      }

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authData.user));

      return {
        user: convertToAuthUser(authData.user),
        profile: profileData,
      };
    } catch (error: any) {
      console.error('[AuthSlice] SignUp Error:', error);
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

/**
 * Sign in with email async thunk
 */
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(handleSupabaseError(error));
      if (!data.user) throw new Error('Sign in failed');

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();

      if (profileError) throw new Error(handleSupabaseError(profileError));

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profileData.id);

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));

      return {
        user: convertToAuthUser(data.user),
        profile: profileData,
      };
    } catch (error: any) {
      console.error('[AuthSlice] SignIn Error:', error);
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

/**
 * Restore session async thunk
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw new Error(handleSupabaseError(error));
      if (!data.session) return null;

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.session.user.id)
        .single();

      return {
        user: convertToAuthUser(data.session.user),
        profile: profileData,
      };
    } catch (error: any) {
      console.error('[AuthSlice] Restore Session Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Sign out async thunk
 */
export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(handleSupabaseError(error));

      // Clear storage
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      return null;
    } catch (error: any) {
      console.error('[AuthSlice] SignOut Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userProfile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userProfile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Restore Session
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.userProfile = action.payload.profile;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Sign Out
    builder
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.userProfile = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
