import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase, handleSupabaseError } from '../../config/supabase';
import { Case, Chapter, UserProgress } from '../../types';

interface GameState {
  cases: Case[];
  currentCase: Case | null;
  chapters: Chapter[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  cases: [],
  currentCase: null,
  chapters: [],
  userProgress: null,
  isLoading: false,
  error: null,
};

/**
 * Fetch all cases
 */
export const fetchAllCases = createAsyncThunk(
  'game/fetchAllCases',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_published', true)
        .order('release_date', { ascending: false });

      if (error) throw new Error(handleSupabaseError(error));
      return data || [];
    } catch (error: any) {
      console.error('[GameSlice] Fetch Cases Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch specific case
 */
export const fetchCase = createAsyncThunk(
  'game/fetchCase',
  async (caseId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw new Error(handleSupabaseError(error));
      return data;
    } catch (error: any) {
      console.error('[GameSlice] Fetch Case Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch case chapters
 */
export const fetchCaseChapters = createAsyncThunk(
  'game/fetchCaseChapters',
  async (caseId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('case_id', caseId)
        .order('chapter_number', { ascending: true });

      if (error) throw new Error(handleSupabaseError(error));
      return data || [];
    } catch (error: any) {
      console.error('[GameSlice] Fetch Chapters Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentCase: (state, action) => {
      state.currentCase = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cases
    builder
      .addCase(fetchAllCases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cases = action.payload;
      })
      .addCase(fetchAllCases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Case
    builder
      .addCase(fetchCase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCase = action.payload;
      })
      .addCase(fetchCase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Chapters
    builder
      .addCase(fetchCaseChapters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCaseChapters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chapters = action.payload;
      })
      .addCase(fetchCaseChapters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentCase, clearError } = gameSlice.actions;
export default gameSlice.reducer;