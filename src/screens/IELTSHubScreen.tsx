import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

const MODULES = [
  { title: 'Listening', band: 7.0, progress: 78, color: colors.cyan,    icon: 'headset-outline',  id: 'ielts-listening' },
  { title: 'Reading',   band: 6.5, progress: 65, color: colors.primary, icon: 'book-outline',     id: 'ielts-reading'  },
  { title: 'Writing',   band: 6.0, progress: 60, color: colors.purple,  icon: 'pencil-outline',   id: 'ielts-writing'  },
  { title: 'Speaking',  band: 6.5, progress: 68, color: colors.success, icon: 'mic-outline',      id: 'speaking'       },
];

const BAND_HISTORY = [5.0, 5.5, 6.0, 6.0, 6.5, 6.5];

export function IELTSHubScreen() {
  const navigation = useNavigation<Nav>();
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
              <Text style={styles.title}>IELTS Preparation</Text>
              <Text style={styles.sub}>Academic · Target Band 7.5</Text>
            </View>
            <LinearGradient colors={['#06b6d4', '#3b82f6']} style={styles.scoreBadge}>
              <Text style={styles.scoreText}>6.5</Text>
              <Text style={styles.scoreLabel}>Band</Text>
            </LinearGradient>
          </View>
        </FadeIn>

        {/* Band Score Tracker */}
        <FadeIn delay={80}>
          <GlassCard style={styles.trackerCard} glow>
            <Text style={styles.trackerTitle}>Band Score Progress</Text>
            <View style={styles.bandRow}>
              {BAND_HISTORY.map((b, i) => (
                <View key={i} style={styles.bandItem}>
                  <View style={[styles.bandBar, {
                    height: b * 10,
                    backgroundColor: i === BAND_HISTORY.length - 1 ? colors.cyan : 'rgba(6,182,212,0.3)',
                  }]} />
                  <Text style={styles.bandLabel}>{b}</Text>
                </View>
              ))}
              <View style={[styles.bandItem, { opacity: 0.4 }]}>
                <View style={[styles.bandBar, { height: 75, borderWidth: 1, borderColor: colors.cyan, borderStyle: 'dashed', backgroundColor: 'transparent' }]} />
                <Text style={styles.bandLabel}>7.5</Text>
              </View>
            </View>
          </GlassCard>
        </FadeIn>

        {/* Module cards */}
        <FadeIn delay={160}>
          <Text style={styles.sectionTitle}>Modules</Text>
          <View style={styles.modulesGrid}>
            {MODULES.map((mod, i) => (
              <GlassCard
                key={i}
                style={styles.modCard}
                onPress={() => mod.title === 'Speaking'
                  ? navigation.navigate('Speaking')
                  : navigation.navigate('Quiz', { id: mod.id })
                }
              >
                <View style={{ alignItems: 'flex-start', gap: 10 }}>
                  <View style={[styles.modIcon, { backgroundColor: mod.color + '22' }]}>
                    <Ionicons name={mod.icon as any} size={20} color={mod.color} />
                  </View>
                  <Text style={styles.modTitle}>{mod.title}</Text>
                  <Text style={[styles.modBand, { color: mod.color }]}>Band {mod.band}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${mod.progress}%`, backgroundColor: mod.color }]} />
                  </View>
                </View>
                <ProgressRing progress={mod.progress} size={52} strokeWidth={5} color={mod.color} showValue={false} />
              </GlassCard>
            ))}
          </View>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={280}>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Quick Actions</Text>
          <View style={{ gap: 10 }}>
            {[
              { icon: 'flash-outline',         label: 'Practice Quiz',    sub: 'Mixed modules · 20 questions', color: colors.cyan,    action: () => navigation.navigate('Quiz', { id: 'ielts-reading' }) },
              { icon: 'document-text-outline', label: 'Full Mock Test',   sub: '4 modules · 2h 45min',         color: colors.primary, action: () => navigation.navigate('MockExam', { id: 'ielts-1' }) },
              { icon: 'mic-outline',           label: 'Speaking Practice', sub: 'Part 1, 2, 3 questions',      color: colors.success, action: () => navigation.navigate('Speaking') },
              { icon: 'layers-outline',        label: 'Vocabulary Cards', sub: 'IELTS Academic wordlist',      color: colors.purple,  action: () => navigation.navigate('Flashcards') },
            ].map((a, i) => (
              <GlassCard key={i} style={styles.actionRow} onPress={a.action}>
                <View style={[styles.actionIcon, { backgroundColor: a.color + '22' }]}>
                  <Ionicons name={a.icon as any} size={20} color={a.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                  <Text style={styles.actionSub}>{a.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
              </GlassCard>
            ))}
          </View>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { paddingHorizontal: 18, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: 'white' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  scoreBadge: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  scoreText: { fontSize: 22, fontWeight: '800', color: 'white' },
  scoreLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: 'white', marginBottom: 10 },
  trackerCard: { padding: 16, gap: 12 },
  trackerTitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  bandRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 80 },
  bandItem: { flex: 1, alignItems: 'center', gap: 4 },
  bandBar: { width: '100%', borderRadius: 4 },
  bandLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  modCard: { width: '47%', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  modIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modTitle: { fontSize: 14, fontWeight: '700', color: 'white' },
  modBand: { fontSize: 13, fontWeight: '600' },
  barBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 2 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  actionIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 14, fontWeight: '600', color: 'white' },
  actionSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
});
