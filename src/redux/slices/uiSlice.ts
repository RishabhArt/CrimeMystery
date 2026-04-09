import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  loadingMessage: string;
  notification: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

const initialState: UIState = {
  isLoading: false,
  loadingMessage: '',
  notification: null,
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
    showNotification: (
      state,
      action: PayloadAction<{ type: 'success' | 'error' | 'info' | 'warning'; message: string }>
    ) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
    },
    toggleVibration: (state) => {
      state.vibrationEnabled = !state.vibrationEnabled;
    },
  },
});

export const {
  setLoading,
  showNotification,
  clearNotification,
  toggleSound,
  toggleMusic,
  toggleVibration,
} = uiSlice.actions;
export default uiSlice.reducer;