import { supabase, handleSupabaseError } from '../config/supabase';
import { AppError } from '../utils/errorHandler';

export const authService = {
  /**
   * Sign up with email
   */
  async signUp(email: string, password: string, displayName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(handleSupabaseError(error));
      if (!data.user) throw new Error('User creation failed');

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: data.user.id,
            email,
            display_name: displayName,
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

      if (profileError) throw new Error(handleSupabaseError(profileError));

      return { user: data.user, profile };
    } catch (error: any) {
      throw new AppError(error.message || 'Sign up failed');
    }
  },

  /**
   * Sign in with email
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(handleSupabaseError(error));
      if (!data.user) throw new Error('Sign in failed');

      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();

      if (profileError) throw new Error(handleSupabaseError(profileError));

      return { user: data.user, profile };
    } catch (error: any) {
      throw new AppError(error.message || 'Sign in failed');
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(handleSupabaseError(error));
    } catch (error: any) {
      throw new AppError(error.message || 'Sign out failed');
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw new Error(handleSupabaseError(error));
      return data.user;
    } catch (error: any) {
      throw new AppError(error.message || 'Get user failed');
    }
  },
};

export default authService;