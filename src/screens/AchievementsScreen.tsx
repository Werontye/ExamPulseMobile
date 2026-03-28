import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import { colors } from '../theme/colors';

const ACHIEVEMENTS = [
  { id: 1,  icon: 'footsteps-outline',    title: 'First Steps',      desc: 'Complete your first quiz',               xp: 50,  unlocked: false, progress: 0, total: 1  },
  { id: 2,  icon: 'flame-outline',        title: 'Week Warrior',     desc: '7-day study streak',                     xp: 100, unlocked: false, progress: 0, total: 7  },
  { id: 3,  icon: 'star-outline',         title: 'Perfect Score',    desc: 'Get 100% on any test',                   xp: 200, unlocked: false, progress: 0, total: 1  },
  { id: 4,  icon: 'book-outline',         title: 'Knowledge Seeker', desc: 'Review 50 flashcards',                   xp: 150, unlocked: false, progress: 0, total: 50 },
  { id: 5,  icon: 'flash-outline',        title: 'Speed Demon',      desc: 'Answer 10 questions in under 5 minutes', xp: 175, unlocked: false, progress: 0, total: 10 },
  { id: 6,  icon: 'school-outline',       title: 'Master Mind',      desc: 'Achieve 90% overall accuracy',           xp: 300, unlocked: false, progress: 0, total: 90 },
  { id: 7,  icon: 'mic-outline',          title: 'Eloquent Speaker', desc: 'Complete 10 speaking practices',         xp: 125, unlocked: false, progress: 0, total: 10 },
  { id: 8,  icon: 'trophy-outline',       title: 'SAT Champion',     desc: 'Score 1400+ on a mock SAT exam',         xp: 500, unlocked: false, progress: 0, total: 1  },
];

const TOTAL_XP = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.xp, 0);
const UNLOCKED = ACHIEVEMENTS.filter(a => a.unlocked).length;

function AchievementCard({ a, delay }: { a: typeof ACHIEVEMENTS[0]; delay: number }) {
  const o = useSharedValue(0);
  const y = useSharedValue(20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    o.value     = withDelay(delay, withTiming(1,    { duration: 400, easing: Easing.out(Easing.cubic) }));
    y.value     = withDelay(delay, withTiming(0,    { duration: 400, easing: Easing.out(Easing.cubic) }));
    scale.value = withDelay(delay, withSpring(1, { damping: 14 }));
  }, []);

  const s = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ translateY: y.value }, { scale: scale.value }],
  }));

  const pct = Math.round((a.progress / a.total) * 100);
  const iconColor = a.unlocked ? colors.warning : 'rgba(255,255,255,0.25)';
  const bgColor   = a.unlocked ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)';

  return (
    <Animated.View style={s}>
      <GlassCard style={[styles.achCard, !a.unlocked && styles.lockedCard] as any}>
        {a.unlocked && <View style={styles.unlockedGlow} />}
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <Ionicons name={a.icon as any} size={26} color={iconColor} />
          {a.unlocked && <View style={styles.unlockedDot} />}
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[styles.achTitle, !a.unlocked && { color: 'rgba(255,255,255,0.4)' }]}>{a.title}</Text>
            {a.unlocked && (
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>+{a.xp} XP</Text>
              </View>
            )}
          </View>
          <Text style={styles.achDesc}>{a.desc}</Text>
          {!a.unlocked && (
            <View style={{ gap: 4, marginTop: 4 }}>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.progressText}>{a.progress} / {a.total}</Text>
            </View>
          )}
        </View>
        {a.unlocked
          ? <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          : <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.2)" />
        }
      </GlassCard>
    </Animated.View>
  );
}

export function AchievementsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.xpBig}>
            <Ionicons name="flash" size={14} color="white" />
            <Text style={styles.xpBigText}>{TOTAL_XP} XP</Text>
          </LinearGradient>
        </View>

        {/* Stats banner */}
        <GlassCard style={styles.statsBanner} glow>
          <ProgressRing
            progress={Math.round((UNLOCKED / ACHIEVEMENTS.length) * 100)}
            size={90}
            strokeWidth={8}
            color={colors.warning}
            label="done"
          />
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={styles.bannerTitle}>
              {UNLOCKED} of {ACHIEVEMENTS.length} Unlocked
            </Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${(UNLOCKED / ACHIEVEMENTS.length) * 100}%`, backgroundColor: colors.warning }]} />
            </View>
            <Text style={styles.bannerSub}>
              {ACHIEVEMENTS.length - UNLOCKED} achievements remaining
            </Text>
          </View>
        </GlassCard>

        {/* Achievements list */}
        <Text style={styles.sectionTitle}>All Achievements</Text>
        <View style={{ gap: 12 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <AchievementCard key={a.id} a={a} delay={i * 60} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { paddingHorizontal: 18, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: 'white' },
  xpBig: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  xpBigText: { fontSize: 14, fontWeight: '700', color: 'white' },
  statsBanner: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: 'white' },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3, backgroundColor: colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
  achCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, position: 'relative', overflow: 'hidden' },
  lockedCard: { opacity: 0.75 },
  unlockedGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundColor: 'rgba(245,158,11,0.05)' },
  iconCircle: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  unlockedDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  achTitle: { fontSize: 14, fontWeight: '700', color: 'white' },
  achDesc: { fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 17 },
  xpBadge: { backgroundColor: 'rgba(245,158,11,0.2)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  xpText: { fontSize: 10, fontWeight: '700', color: colors.warning },
  progressText: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
});
