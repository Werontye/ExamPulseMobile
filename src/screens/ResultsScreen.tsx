import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'Results'>;
type Route = RouteProp<RootStackParamList, 'Results'>;

const TOPIC_BREAKDOWN = [
  { topic: 'Algebra',     correct: 8,  total: 10 },
  { topic: 'Geometry',    correct: 6,  total: 8  },
  { topic: 'Data Analysis', correct: 4, total: 6 },
  { topic: 'Functions',   correct: 5,  total: 6  },
];

function Confetti() {
  const DOTS = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: [colors.primary, colors.purple, colors.cyan, colors.success, colors.warning][i % 5],
    delay: i * 100,
    size: 6 + Math.random() * 6,
  }));
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {DOTS.map(d => <ConfettiDot key={d.id} dot={d} />)}
    </View>
  );
}

function ConfettiDot({ dot }: { dot: any }) {
  const y = useSharedValue(-20);
  const x = useSharedValue(0);
  const o = useSharedValue(1);
  const r = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(dot.delay, withTiming(700, { duration: 2500, easing: Easing.out(Easing.cubic) }));
    x.value = withDelay(dot.delay, withTiming((Math.random() - 0.5) * 60, { duration: 2500 }));
    o.value = withDelay(dot.delay + 1500, withTiming(0, { duration: 1000 }));
    r.value = withDelay(dot.delay, withTiming(720, { duration: 2500 }));
  }, []);
  const s = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }, { rotate: `${r.value}deg` }],
    opacity: o.value,
    position: 'absolute',
    left: `${dot.x}%`,
    top: 0,
    width: dot.size,
    height: dot.size,
    borderRadius: dot.size / 4,
    backgroundColor: dot.color,
  }));
  return <Animated.View style={s} />;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const o = useSharedValue(0); const y = useSharedValue(24);
  useEffect(() => {
    o.value = withDelay(delay, withTiming(1, { duration: 450 }));
    y.value = withDelay(delay, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }));
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));
  return <Animated.View style={s}>{children}</Animated.View>;
}

export function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const insets     = useSafeAreaInsets();
  const { score, total, correct, timeTaken } = route.params;
  const wrong = total - correct;
  const accuracy = score;

  useEffect(() => {
    if (score >= 70) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const grade = score >= 90 ? 'Excellent!' : score >= 75 ? 'Great Job!' : score >= 60 ? 'Good Work!' : 'Keep Practising!';
  const gradeColor = score >= 90 ? colors.success : score >= 75 ? colors.primary : score >= 60 ? colors.warning : colors.error;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      {score >= 70 && <Confetti />}

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backBtn}>
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}>
        {/* Hero */}
        <FadeIn delay={0}>
          <GlassCard style={styles.heroCard} glow>
            <Text style={[styles.grade, { color: gradeColor }]}>{grade}</Text>
            <ProgressRing progress={score} size={150} strokeWidth={12} color={gradeColor} label="%" />
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatVal, { color: colors.success }]}>{correct}</Text>
                <Text style={styles.heroStatLabel}>Correct</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatVal, { color: colors.error }]}>{wrong}</Text>
                <Text style={styles.heroStatLabel}>Incorrect</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatVal, { color: colors.cyan }]}>{fmt(timeTaken)}</Text>
                <Text style={styles.heroStatLabel}>Time</Text>
              </View>
            </View>
          </GlassCard>
        </FadeIn>

        {/* Topic Breakdown */}
        <FadeIn delay={200}>
          <Text style={styles.sectionTitle}>Topic Breakdown</Text>
          <GlassCard style={{ padding: 16, gap: 14 }}>
            {TOPIC_BREAKDOWN.map((t, i) => {
              const pct = Math.round((t.correct / t.total) * 100);
              const c = pct >= 80 ? colors.success : pct >= 60 ? colors.warning : colors.error;
              return (
                <View key={i} style={{ gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.topicLabel}>{t.topic}</Text>
                    <Text style={[styles.topicPct, { color: c }]}>{t.correct}/{t.total} ({pct}%)</Text>
                  </View>
                  <View style={styles.barBg}>
                    <Animated.View style={[styles.barFill, { width: `${pct}%`, backgroundColor: c }]} />
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </FadeIn>

        {/* Strengths & Weaknesses */}
        <FadeIn delay={340}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <GlassCard style={[styles.swCard, { borderColor: 'rgba(16,185,129,0.3)' }]}>
              <View style={styles.swHeader}>
                <Ionicons name="trending-up" size={16} color={colors.success} />
                <Text style={[styles.swTitle, { color: colors.success }]}>Strengths</Text>
              </View>
              {TOPIC_BREAKDOWN.filter(t => t.correct / t.total >= 0.75).map((t, i) => (
                <Text key={i} style={styles.swItem}>• {t.topic}</Text>
              ))}
            </GlassCard>
            <GlassCard style={[styles.swCard, { borderColor: 'rgba(239,68,68,0.3)' }]}>
              <View style={styles.swHeader}>
                <Ionicons name="trending-down" size={16} color={colors.error} />
                <Text style={[styles.swTitle, { color: colors.error }]}>Weaknesses</Text>
              </View>
              {TOPIC_BREAKDOWN.filter(t => t.correct / t.total < 0.75).map((t, i) => (
                <Text key={i} style={styles.swItem}>• {t.topic}</Text>
              ))}
            </GlassCard>
          </View>
        </FadeIn>

        {/* Buttons */}
        <FadeIn delay={460}>
          <View style={{ gap: 12 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.btn}>
                <Ionicons name="refresh" size={18} color="white" />
                <Text style={styles.btnText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} activeOpacity={0.85}>
              <GlassCard style={styles.outlineBtn}>
                <Ionicons name="home-outline" size={18} color={colors.primary} />
                <Text style={styles.outlineBtnText}>Go Home</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
  scroll: { paddingHorizontal: 16, gap: 16 },
  heroCard: { padding: 24, alignItems: 'center', gap: 16 },
  grade: { fontSize: 26, fontWeight: '800' },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  heroStat: { alignItems: 'center', gap: 4 },
  heroStatVal: { fontSize: 20, fontWeight: '800' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  divider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
  topicLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  topicPct: { fontSize: 12, fontWeight: '600' },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  swCard: { flex: 1, padding: 14, gap: 8, borderWidth: 1 },
  swHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swTitle: { fontSize: 13, fontWeight: '700' },
  swItem: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 },
  outlineBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
});
