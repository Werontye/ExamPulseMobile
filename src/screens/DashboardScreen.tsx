import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width: W } = Dimensions.get('window');

function FadeInView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useSharedValue(0);
  const y       = useSharedValue(20);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }));
    y.value       = withDelay(delay, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: y.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

const STATS = [
  { icon: 'flame',            value: '0',   label: 'Day Streak', color: '#f97316' },
  { icon: 'book',             value: '0',   label: 'Questions',  color: colors.primary },
  { icon: 'checkmark-circle', value: '0%',  label: 'Accuracy',   color: colors.success },
];

const TODAY_TASKS = [
  { id: 1, title: 'SAT Math Practice', subtitle: '20 questions · 25 min', done: false, icon: 'calculator-outline' },
  { id: 2, title: 'IELTS Reading',     subtitle: '15 questions · 20 min', done: false, icon: 'book-outline'       },
  { id: 3, title: 'Speaking Practice', subtitle: '3 questions · 15 min',  done: false, icon: 'mic-outline'        },
];

const RECENT: { title: string; score: string; pct: number; color: string }[] = [];

export function DashboardScreen() {
  const navigation = useNavigation<Nav>() as any;
  const insets     = useSafeAreaInsets();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userName').then(n => { if (n) setUserName(n); });
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeInView delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back, {userName || 'there'}!</Text>
              <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            </View>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.avatar}>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                {userName ? userName[0].toUpperCase() : '?'}
              </Text>
            </LinearGradient>
          </View>
        </FadeInView>

        {/* Exam countdown */}
        <FadeInView delay={80}>
          <GlassCard style={styles.countdown} glow>
            <LinearGradient colors={['rgba(99,102,241,0.2)', 'rgba(139,92,246,0.1)']} style={styles.countdownGrad}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.countdownText}>SAT Exam in <Text style={{ color: colors.primary, fontWeight: '800' }}>42 Days</Text></Text>
            </LinearGradient>
          </GlassCard>
        </FadeInView>

        {/* Stats row */}
        <FadeInView delay={160}>
          <View style={styles.statsRow}>
            {STATS.map((s, i) => (
              <GlassCard key={i} style={styles.statCard}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </GlassCard>
            ))}
          </View>
        </FadeInView>

        {/* Overall progress */}
        <FadeInView delay={240}>
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.sectionTitle}>Overall Progress</Text>
                <Text style={styles.progressSub}>Complete quizzes to track your progress</Text>
                <View style={styles.progressBars}>
                  {[
                    { label: 'SAT Math',      pct: 0, color: colors.primary },
                    { label: 'IELTS Reading', pct: 0, color: colors.cyan   },
                    { label: 'Speaking',      pct: 0, color: colors.purple  },
                  ].map((b, i) => (
                    <View key={i} style={{ gap: 4 }}>
                      <View style={styles.barLabelRow}>
                        <Text style={styles.barLabel}>{b.label}</Text>
                        <Text style={[styles.barLabel, { color: b.color }]}>{b.pct}%</Text>
                      </View>
                      <View style={styles.barBg}>
                        <Animated.View style={[styles.barFill, { width: `${b.pct}%`, backgroundColor: b.color }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <ProgressRing progress={0} size={90} label="Overall" color={colors.primary} />
            </View>
          </GlassCard>
        </FadeInView>

        {/* Study modules */}
        <FadeInView delay={320}>
          <Text style={styles.sectionTitle}>Study Modules</Text>
          <View style={styles.modulesRow}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('SAT')} activeOpacity={0.85}>
              <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.moduleCard}>
                <Ionicons name="book" size={28} color="white" />
                <Text style={styles.moduleTitle}>SAT</Text>
                <Text style={styles.moduleSub}>Start practising</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('IELTS')} activeOpacity={0.85}>
              <LinearGradient colors={['#06b6d4', '#3b82f6']} style={styles.moduleCard}>
                <Ionicons name="globe" size={28} color="white" />
                <Text style={styles.moduleTitle}>IELTS</Text>
                <Text style={styles.moduleSub}>Start practising</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Today's Plan */}
        <FadeInView delay={400}>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Today's Plan</Text>
          <View style={{ gap: 10 }}>
            {TODAY_TASKS.map((task, i) => (
              <GlassCard key={task.id} style={styles.taskCard}>
                <View style={styles.taskRow}>
                  <View style={[styles.taskIconWrap, { backgroundColor: task.done ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)' }]}>
                    <Ionicons name={task.icon as any} size={20} color={task.done ? colors.success : colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskTitle, task.done && { color: 'rgba(255,255,255,0.4)' }]}>{task.title}</Text>
                    <Text style={styles.taskSub}>{task.subtitle}</Text>
                  </View>
                  <Ionicons
                    name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={task.done ? colors.success : 'rgba(255,255,255,0.2)'}
                  />
                </View>
              </GlassCard>
            ))}
          </View>
        </FadeInView>

        {/* Recent Activity */}
        <FadeInView delay={480}>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Activity</Text>
          {RECENT.length === 0 ? (
            <GlassCard style={{ padding: 20, alignItems: 'center', gap: 8 }}>
              <Ionicons name="time-outline" size={28} color="rgba(255,255,255,0.2)" />
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                No activity yet. Complete a quiz to see your results here.
              </Text>
            </GlassCard>
          ) : (
            <View style={{ gap: 10 }}>
              {RECENT.map((r, i) => (
                <GlassCard key={i} style={styles.recentCard}>
                  <View style={styles.recentRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recentTitle}>{r.title}</Text>
                      <Text style={styles.recentScore}>{r.score}</Text>
                    </View>
                    <View style={styles.recentBadge}>
                      <Text style={[styles.recentPct, { color: r.color }]}>{r.pct}%</Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}
        </FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { paddingHorizontal: 18, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 22, fontWeight: '800', color: 'white' },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  countdown: { overflow: 'hidden' },
  countdownGrad: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 18, paddingVertical: 14,
  },
  countdownText: { fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  progressCard: { padding: 18 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  progressSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  progressBars: { gap: 8, marginTop: 8 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: 'white', marginBottom: 8 },
  modulesRow: { flexDirection: 'row', gap: 12 },
  moduleCard: {
    padding: 20, borderRadius: 20, alignItems: 'flex-start', gap: 6,
    shadowColor: '#6366f1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  moduleTitle: { fontSize: 18, fontWeight: '800', color: 'white' },
  moduleSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  taskCard: { padding: 14 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { fontSize: 14, fontWeight: '600', color: 'white' },
  taskSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  recentCard: { padding: 14 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recentTitle: { fontSize: 14, fontWeight: '600', color: 'white' },
  recentScore: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  recentBadge: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 2,
    borderColor: 'rgba(99,102,241,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  recentPct: { fontSize: 14, fontWeight: '700' },
});
