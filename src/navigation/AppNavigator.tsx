import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/ThemeContext';
import { useAppSelector } from '../hooks/useStore';
import { RootStackParamList, MainTabParamList } from '../types';

import HomeScreen from '../screens/Home/HomeScreen';
import EarnScreen from '../screens/Earn/EarnScreen';
import DailyRewardScreen from '../screens/Earn/DailyRewardScreen';
import TaskDetailScreen from '../screens/Earn/TaskDetailScreen';
import SpinWheelScreen from '../screens/Earn/SpinWheelScreen';
import HistoryScreen from '../screens/Statistics/HistoryScreen';
import LeaderboardScreen from '../screens/Statistics/LeaderboardScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AchievementsScreen from '../screens/Achievements/AchievementsScreen';
import ReferralScreen from '../screens/Profile/ReferralScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.tabBar,
          borderTopColor: c.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Earn"
        component={EarnScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="currency-usd" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={DailyRewardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();
  const user = useAppSelector(state => state.user);
  const c = theme.colors;

  const navTheme = {
    ...DefaultTheme,
    dark: theme.dark,
    colors: {
      ...DefaultTheme.colors,
      primary: c.primary,
      background: c.background,
      card: c.card,
      text: c.textPrimary,
      border: c.border,
      notification: c.accentOrange,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={user.hasCompletedOnboarding ? 'MainTabs' : 'Onboarding'}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: c.background },
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{
            headerShown: true,
            headerTitle: 'Task Details',
            headerStyle: { backgroundColor: c.surface },
            headerTintColor: c.textPrimary,
          }}
        />
        <Stack.Screen
          name="SpinWheel"
          component={SpinWheelScreen}
          options={{
            headerShown: true,
            headerTitle: 'Spin & Win',
            headerStyle: { backgroundColor: c.surface },
            headerTintColor: c.textPrimary,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: true,
            headerTitle: 'Edit Profile',
            headerStyle: { backgroundColor: c.surface },
            headerTintColor: c.textPrimary,
          }}
        />
        <Stack.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Achievements',
            headerStyle: { backgroundColor: c.surface },
            headerTintColor: c.textPrimary,
          }}
        />
        <Stack.Screen
          name="Referral"
          component={ReferralScreen}
          options={{
            headerShown: true,
            headerTitle: 'Invite Friends',
            headerStyle: { backgroundColor: c.surface },
            headerTintColor: c.textPrimary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
