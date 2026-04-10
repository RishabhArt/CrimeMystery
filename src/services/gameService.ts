import { supabase, handleSupabaseError } from '../config/supabase';
import { AppError } from '../utils/errorHandler';

export const gameService = {
  /**
   * Fetch all cases
   */
  async getAllCases() {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_published', true)
        .order('release_date', { ascending: false });

      if (error) throw new Error(handleSupabaseError(error));
      return data || [];
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to fetch cases');
    }
  },

  /**
   * Fetch specific case
   */
  async getCase(caseId: string) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw new Error(handleSupabaseError(error));
      return data;
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to fetch case');
    }
  },

  /**
   * Fetch chapters for case
   */
  async getChapters(caseId: string) {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('case_id', caseId)
        .order('chapter_number', { ascending: true });

      if (error) throw new Error(handleSupabaseError(error));
      return data || [];
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to fetch chapters');
    }
  },
};

export default gameService;