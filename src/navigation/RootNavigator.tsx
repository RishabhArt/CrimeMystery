import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { restoreSession } from '../redux/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../config/colors';

/**
 * Root Navigator
 * Handles routing based on authentication state
 */
const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Try to restore session on app start
        await dispatch(restoreSession()).unwrap();
      } catch (error) {
        console.log('[RootNavigator] No session to restore');
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrap();
  }, [dispatch]);

  if (bootstrapping || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;