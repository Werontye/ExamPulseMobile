import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
// AuthScreen disabled — no profile feature yet
// import { AuthScreen } from '../screens/AuthScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SATHubScreen } from '../screens/SATHubScreen';
import { IELTSHubScreen } from '../screens/IELTSHubScreen';
import { SpeakingScreen } from '../screens/SpeakingScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { MockExamScreen } from '../screens/MockExamScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { FlashcardsScreen } from '../screens/FlashcardsScreen';
import { SetupScreen } from '../screens/SetupScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Setup: undefined;
  MainTabs: undefined;
  Quiz: { id: string; section?: string };
  MockExam: { id: string };
  Results: { id: string; score: number; total: number; correct: number; timeTaken: number };
  Flashcards: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  SAT: undefined;
  IELTS: undefined;
  Speaking: undefined;
  Achievements: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_CONFIG = [
  { name: 'Dashboard', label: 'Home',     active: 'home',    inactive: 'home-outline'    },
  { name: 'SAT',       label: 'SAT',      active: 'book',    inactive: 'book-outline'    },
  { name: 'IELTS',     label: 'IELTS',    active: 'globe',   inactive: 'globe-outline'   },
  { name: 'Speaking',  label: 'Speaking', active: 'mic',     inactive: 'mic-outline'     },
  { name: 'Achievements', label: 'Progress', active: 'trophy', inactive: 'trophy-outline' },
] as const;

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 6 }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const cfg = TAB_CONFIG.find(t => t.name === route.name) ?? TAB_CONFIG[0];

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
              activeOpacity={0.8}
            >
              {isFocused && <View style={styles.activeBlob} />}
              <Ionicons
                name={(isFocused ? cfg.active : cfg.inactive) as any}
                size={22}
                color={isFocused ? colors.primary : colors.text.tertiary}
              />
              <Text style={[styles.label, { color: isFocused ? colors.primary : colors.text.tertiary }]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'shift' }}
    >
      <Tab.Screen name="Dashboard"    component={DashboardScreen}    />
      <Tab.Screen name="SAT"          component={SATHubScreen}       />
      <Tab.Screen name="IELTS"        component={IELTSHubScreen}     />
      <Tab.Screen name="Speaking"     component={SpeakingScreen}     />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash"      component={SplashScreen}    />
        <Stack.Screen name="Onboarding"  component={OnboardingScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Setup"       component={SetupScreen}      options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="MainTabs"    component={MainTabs}         options={{ animation: 'fade' }} />
        <Stack.Screen name="Quiz"        component={QuizScreen}       options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="MockExam"    component={MockExamScreen}   options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Results"     component={ResultsScreen}    options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Flashcards"  component={FlashcardsScreen} options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20,20,31,0.95)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 22,
    position: 'relative',
    gap: 2,
  },
  activeBlob: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
