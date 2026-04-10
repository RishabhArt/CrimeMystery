import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../config/colors';

// Screens (we'll create these next)
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ animationTypeForReplace: 'pop' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;