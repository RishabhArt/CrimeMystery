import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

/**
 * Redux Store Configuration
 * Simplified with:
 * - Redux Toolkit for easier state management
 * - Serialization check for debugging
 * - DevTools integration
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    ui: uiReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setSession', 'auth/setUser'],
        ignoredPaths: ['auth.session'],
      },
    }),
  devTools: process.env.EXPO_PUBLIC_ENABLE_LOGS === 'true',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
