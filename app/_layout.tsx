import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from '../src/redux/store';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Crime Mystery' }} />
            <Stack.Screen name="auth" options={{ title: 'Sign In' }} />
            <Stack.Screen name="cases" options={{ title: 'Cases' }} />
            <Stack.Screen name="case/[id]" options={{ title: 'Case Details' }} />
          </Stack>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
