import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<Nav>();

  const logoScale   = useSharedValue(0);
  const logoRotate  = useSharedValue(-180);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY       = useSharedValue(24);
  const tagOpacity   = useSharedValue(0);
  const tagY         = useSharedValue(16);

  useEffect(() => {
    logoScale.value   = withSpring(1, { damping: 11, stiffness: 110 });
    logoRotate.value  = withSpring(0, { damping: 13, stiffness: 90 });
    logoOpacity.value = withTiming(1, { duration: 400 });

    titleOpacity.value = withDelay(450, withTiming(1, { duration: 500 }));
    titleY.value       = withDelay(450, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    tagOpacity.value = withDelay(750, withTiming(1, { duration: 500 }));
    tagY.value       = withDelay(750, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    const t = setTimeout(async () => {
      const userName = await AsyncStorage.getItem('userName');
      navigation.replace(userName ? 'MainTabs' : 'Onboarding');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const logoStyle  = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const tagStyle   = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
    transform: [{ translateY: tagY.value }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoGrad}>
            <Ionicons name="flash" size={48} color="white" />
          </LinearGradient>
        </Animated.View>
        <Animated.Text style={[styles.title, titleStyle]}>ExamPulse</Animated.Text>
        <Animated.Text style={[styles.tagline, tagStyle]}>Your path to exam success</Animated.Text>
      </View>
      <Animated.View style={[styles.dotsRow, tagStyle]}>
        {[0, 1, 2].map(i => <PulsingDot key={i} delay={i * 220} />)}
      </Animated.View>
    </View>
  );
}

function PulsingDot({ delay }: { delay: number }) {
  const s = useSharedValue(1);
  const o = useSharedValue(0.35);
  useEffect(() => {
    const run = () => {
      s.value = withSequence(withTiming(1.6, { duration: 380 }), withTiming(1, { duration: 380 }));
      o.value = withSequence(withTiming(1,   { duration: 380 }), withTiming(0.35, { duration: 380 }));
    };
    const t1 = setTimeout(run, delay);
    const t2 = setInterval(run, 1200);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: o.value }));
  return <Animated.View style={[styles.dot, anim]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  logoWrap: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 20,
    marginBottom: 6,
  },
  logoGrad: {
    width: 96, height: 96, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 36, fontWeight: '800', color: 'white', letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.3 },
  dotsRow: { flexDirection: 'row', gap: 8, alignSelf: 'center', paddingBottom: 64 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
