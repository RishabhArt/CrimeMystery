import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../config/colors';

// Screen imports (we'll create these)
import HomeScreen from '../screens/home/HomeScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Home Stack Navigator
 */
const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
};

/**
 * Shop Stack Navigator
 */
const ShopStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ShopMain" component={ShopScreen} />
    </Stack.Navigator>
  );
};

/**
 * Profile Stack Navigator
 */
const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

/**
 * App Navigator (Bottom Tab Navigation)
 */
const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          borderTopColor: COLORS.DIVIDER,
          backgroundColor: COLORS.SURFACE,
          paddingTop: 5,
          paddingBottom: 5,
          height: 70,
        },
        tabBarLabelStyle: {
          ...TYPOGRAPHY.CAPTION,
          marginTop: 4,
        },
        tabBarIconStyle: {
          width: 32,
          height: 32,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Cases',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopStackNavigator}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💎</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;