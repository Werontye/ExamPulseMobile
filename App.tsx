import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreenExpo from 'expo-splash-screen';
import { AppNavigator } from './src/navigation';

SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const t = setTimeout(() => SplashScreenExpo.hideAsync(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0a0a0f" translucent />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
