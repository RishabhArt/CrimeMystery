import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/redux/store';
import { initializeSupabaseListeners, supabase } from './src/config/supabase';
import RootNavigator from './src/navigation/RootNavigator';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from './src/config/colors';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Supabase listeners
        initializeSupabaseListeners();

        // Check if session exists
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[App] Error getting session:', error);
        }

        console.log('[App] Session:', session ? 'exists' : 'does not exist');
        setIsReady(true);
      } catch (error) {
        console.error('[App] Initialization error:', error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}