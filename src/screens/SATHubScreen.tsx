import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const o = useSharedValue(0); const y = useSharedValue(20);
  useEffect(() => {
    o.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    y.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));
  return <Animated.View style={s}>{children}</Animated.View>;
}

const SECTIONS = [
  { title: 'Math',                 progress: 78, color: colors.primary, icon: 'calculator-outline', section: 'math',    questions: 40 },
  { title: 'Reading & Writing',    progress: 65, color: colors.cyan,    icon: 'book-outline',       section: 'reading', questions: 15 },
  { title: 'Writing & Language',   progress: 70, color: colors.purple,  icon: 'pencil-outline',     section: 'writing', questions: 15 },
];

const WEAK_TOPICS = [
  { topic: 'Complex Numbers',       pct: 42, section: 'math'    },
  { topic: 'Evidence-Based Reading', pct: 55, section: 'reading' },
  { topic: 'Comma Usage',           pct: 61, section: 'writing' },
];

export function SATHubScreen() {
  const navigation = useNavigation<Nav>() as any;
  const insets     = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeIn delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>SAT Preparation</Text>
              <Text style={styles.sub}>Digital SAT · 2024-2025</Text>
            </View>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.scoreBadge}>
              <Text style={styles.scoreText}>1280</Text>
              <Text style={styles.scoreLabel}>/1600</Text>
            </LinearGradient>
          </View>
        </FadeIn>

        {/* Section cards */}
        <FadeIn delay={80}>
          <Text style={styles.sectionTitle}>Sections</Text>
          <View style={{ gap: 12 }}>
            {SECTIONS.map((sec, i) => (
              <GlassCard key={i} style={styles.sectionCard} onPress={() => navigation.navigate('Quiz', { id: `sat-${sec.section}`, section: sec.section })}>
                <View style={styles.sectionRow}>
                  <View style={[styles.sectionIcon, { backgroundColor: sec.color + '22' }]}>
                    <Ionicons name={sec.icon as any} size={22} color={sec.color} />
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.sectionName}>{sec.title}</Text>
                      <Text style={[styles.sectionPct, { color: sec.color }]}>{sec.progress}%</Text>
                    </View>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${sec.progress}%`, backgroundColor: sec.color }]} />
                    </View>
                    <Text style={styles.qCount}>{sec.questions} questions available</Text>
                  </View>
                  <ProgressRing progress={sec.progress} size={56} strokeWidth={5} color={sec.color} label="%" />
                </View>
              </GlassCard>
            ))}
          </View>
        </FadeIn>

        {/* Quick actions */}
        <FadeIn delay={200}>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionBtn icon="flash-outline"   label="Practice Quiz"  color={colors.primary} onPress={() => navigation.navigate('Quiz',    { id: 'sat-math'   })} />
            <ActionBtn icon="document-text-outline" label="Mock Exam" color={colors.purple}  onPress={() => navigation.navigate('MockExam', { id: 'sat-1'     })} />
            <ActionBtn icon="layers-outline"  label="Flashcards"     color={colors.cyan}    onPress={() => navigation.navigate('Flashcards')} />
            <ActionBtn icon="bar-chart-outline" label="Analytics"    color={colors.success} onPress={() => {}} />
          </View>
        </FadeIn>

        {/* Weak Topics */}
        <FadeIn delay={320}>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Weak Topics</Text>
          <GlassCard style={{ padding: 16, gap: 14 }}>
            {WEAK_TOPICS.map((w, i) => (
              <View key={i} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.weakTopic}>{w.topic}</Text>
                  <Text style={{ fontSize: 12, color: colors.warning, fontWeight: '600' }}>{w.pct}%</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${w.pct}%`, backgroundColor: colors.warning }]} />
                </View>
              </View>
            ))}
          </GlassCard>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

function ActionBtn({ icon, label, color, onPress }: { icon: string; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1, minWidth: '45%' }}>
      <GlassCard style={styles.actionCard}>
        <View style={[styles.actionIcon, { backgroundColor: color + '22' }]}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { paddingHorizontal: 18, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: 'white' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  scoreBadge: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, gap: 2 },
  scoreText: { fontSize: 22, fontWeight: '800', color: 'white' },
  scoreLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: 'white', marginBottom: 10 },
  sectionCard: { padding: 14 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionName: { fontSize: 14, fontWeight: '700', color: 'white' },
  sectionPct: { fontSize: 13, fontWeight: '600' },
  qCount: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { padding: 16, gap: 8, alignItems: 'flex-start' },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 13, fontWeight: '600', color: 'white' },
  weakTopic: { fontSize: 13, fontWeight: '600', color: 'white' },
});
