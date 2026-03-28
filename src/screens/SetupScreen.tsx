import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

export function SetupScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    btnScale.value = withSpring(0.95, { damping: 10 }, () => {
      btnScale.value = withSpring(1);
    });
    await AsyncStorage.setItem('userName', trimmed);
    navigation.replace('MainTabs');
  };

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '?';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <AnimatedBackground />
        <View style={[styles.inner, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.title}>What's your name?</Text>
          <Text style={styles.subtitle}>We'll personalise your study experience</Text>

          <View style={[styles.inputWrap, focused && styles.inputFocused]}>
            <Ionicons name="person-outline" size={20} color={focused ? colors.primary : 'rgba(255,255,255,0.3)'} />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              maxLength={30}
            />
          </View>

          <Animated.View style={[{ width: '100%' }, btnStyle]}>
            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.85}
              disabled={!name.trim()}
            >
              <LinearGradient
                colors={name.trim() ? ['#6366f1', '#8b5cf6'] : ['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={[styles.btnText, { opacity: name.trim() ? 1 : 0.5 }]}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={{ opacity: name.trim() ? 1 : 0.5 }} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { flex: 1, paddingHorizontal: 28, alignItems: 'center', gap: 20 },
  avatarWrap: { marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 36, fontWeight: '800', color: 'white' },
  title: { fontSize: 28, fontWeight: '800', color: 'white', textAlign: 'center', letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: -8 },
  inputWrap: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16, paddingVertical: 14, marginTop: 8,
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: 'rgba(99,102,241,0.1)' },
  input: { flex: 1, fontSize: 16, color: 'white', fontWeight: '500' },
  btn: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 16,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: 'white' },
});
