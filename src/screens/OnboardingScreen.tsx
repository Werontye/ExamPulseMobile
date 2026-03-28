import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

const { width: W } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    id: '1',
    icon: 'book-outline' as const,
    iconColors: ['#06b6d4', '#3b82f6'] as const,
    title: 'Master SAT & IELTS',
    subtitle: 'Comprehensive preparation for SAT and IELTS exams with structured study plans and real practice tests.',
  },
  {
    id: '2',
    icon: 'bulb-outline' as const,
    iconColors: ['#8b5cf6', '#ec4899'] as const,
    title: 'Smart Practice',
    subtitle: 'Practice with real exam questions. Instant feedback, detailed explanations, and adaptive difficulty.',
  },
  {
    id: '3',
    icon: 'trending-up-outline' as const,
    iconColors: ['#10b981', '#059669'] as const,
    title: 'Track Your Progress',
    subtitle: 'Monitor improvement with detailed analytics, performance insights, and topic breakdowns.',
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [current, setCurrent] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setCurrent(viewableItems[0].index ?? 0);
  }).current;

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: current + 1, animated: true });
    } else {
      navigation.replace('Setup');
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.id}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <SlideItem slide={item} index={index} currentIndex={current} />
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => <AnimatedDot key={i} active={i === current} />)}
      </View>

      {/* Button */}
      <TouchableOpacity onPress={goNext} activeOpacity={0.85} style={styles.btnWrap}>
        <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
          <Text style={styles.btnText}>
            {current === SLIDES.length - 1 ? "Let's Start" : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Skip */}
      {current < SLIDES.length - 1 && (
        <TouchableOpacity onPress={() => navigation.replace('Setup')} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AnimatedDot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 24 : 8);
  const opacity = useSharedValue(active ? 1 : 0.35);
  useEffect(() => {
    width.value = withTiming(active ? 24 : 8, { duration: 300 });
    opacity.value = withTiming(active ? 1 : 0.35, { duration: 300 });
  }, [active]);
  const s = useAnimatedStyle(() => ({ width: width.value, opacity: opacity.value }));
  return <Animated.View style={[styles.dot, s]} />;
}

function SlideItem({ slide, index, currentIndex }: { slide: typeof SLIDES[0]; index: number; currentIndex: number }) {
  const iconScale = useSharedValue(index === currentIndex ? 1 : 0.85);
  const iconOpacity = useSharedValue(index === currentIndex ? 1 : 0.5);

  React.useEffect(() => {
    iconScale.value   = withSpring(index === currentIndex ? 1 : 0.85, { damping: 14 });
    iconOpacity.value = withTiming(index === currentIndex ? 1 : 0.5, { duration: 300 });
  }, [currentIndex]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconOpacity.value,
  }));

  return (
    <View style={{ width: W, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 28 }}>
      <Animated.View style={anim}>
        <LinearGradient colors={slide.iconColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconCircle}>
          <Ionicons name={slide.icon} size={56} color="white" />
        </LinearGradient>
      </Animated.View>
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  iconCircle: {
    width: 130, height: 130, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#6366f1', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5, shadowRadius: 24, elevation: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: 'white', textAlign: 'center', letterSpacing: -0.3 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 6, alignSelf: 'center', marginBottom: 24 },
  dot: { height: 8, borderRadius: 4 },
  btnWrap: { marginHorizontal: 24, marginBottom: 16 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 16,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: 'white' },
  skip: { alignSelf: 'center', paddingBottom: 20 },
  skipText: { fontSize: 15, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
});
