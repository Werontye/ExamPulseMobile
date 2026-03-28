import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { satQuestions, SATQuestion } from '../data/sat-questions';
import { ieltsQuestions, IELTSQuestion } from '../data/ielts-questions';
import { RootStackParamList } from '../navigation';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
type Route = RouteProp<RootStackParamList, 'Quiz'>;
const { width: W } = Dimensions.get('window');

type AnyQ = SATQuestion | IELTSQuestion;

function getQuestions(id: string): AnyQ[] {
  const all = id.startsWith('ielts')
    ? ieltsQuestions.filter(q => id.includes(q.module) || id === 'ielts-reading')
    : satQuestions.filter(q => id.includes(q.section) || q.section === 'math');
  return all.slice(0, 20).length ? all.slice(0, 20) : satQuestions.slice(0, 20);
}

export function QuizScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const insets     = useSafeAreaInsets();
  const questions  = getQuestions(route.params.id);

  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked,  setChecked]  = useState(false);
  const [correct,  setCorrect]  = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min

  const cardScale  = useSharedValue(1);
  const shakeX     = useSharedValue(0);
  const explHeight = useSharedValue(0);

  const q = questions[idx];
  const opts = q.options ? Object.entries(q.options) : [];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const check = () => {
    if (!selected) return;
    setChecked(true);
    if (selected === q.answer) {
      setCorrect(c => c + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      cardScale.value = withSequence(withSpring(1.03, { damping: 10 }), withSpring(1));
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }), withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
    }
    explHeight.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
  };

  const next = () => {
    if (idx >= questions.length - 1) {
      navigation.replace('Results', {
        id: route.params.id,
        score: Math.round((correct / questions.length) * 100),
        total: questions.length,
        correct,
        timeTaken: 300 - timeLeft,
      });
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setChecked(false);
      explHeight.value = 0;
      cardScale.value = withSpring(1);
    }
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }, { translateX: shakeX.value }],
  }));
  const explStyle = useAnimatedStyle(() => ({
    opacity: explHeight.value,
    maxHeight: explHeight.value * 200,
    overflow: 'hidden',
  }));

  const optionColor = (key: string) => {
    if (!checked) return selected === key ? colors.primary : 'transparent';
    if (key === q.answer) return colors.success;
    if (key === selected && key !== q.answer) return colors.error;
    return 'transparent';
  };

  const optionBorder = (key: string) => {
    if (!checked) return selected === key ? colors.primary : 'rgba(255,255,255,0.1)';
    if (key === q.answer) return colors.success;
    if (key === selected && key !== q.answer) return colors.error;
    return 'rgba(255,255,255,0.1)';
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{idx + 1} / {questions.length}</Text>
        </View>
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={14} color={timeLeft < 60 ? colors.error : colors.primary} />
          <Text style={[styles.timerText, { color: timeLeft < 60 ? colors.error : 'white' }]}>{fmt(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        {/* Section / difficulty badge */}
        <View style={styles.badgeRow}>
          <View style={styles.sectionBadge}>
            <Text style={styles.badgeText}>{'section' in q ? q.section.toUpperCase() : (q as IELTSQuestion).module.toUpperCase()}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: diffColor(q.difficulty) + '22' }]}>
            <Text style={[styles.badgeText, { color: diffColor(q.difficulty) }]}>{q.difficulty}</Text>
          </View>
          <Text style={styles.topicBadge}>{q.topic}</Text>
        </View>

        {/* Question card */}
        <Animated.View style={cardStyle}>
          <GlassCard style={styles.qCard} hover={false}>
            <Text style={styles.questionText}>{q.question}</Text>
          </GlassCard>
        </Animated.View>

        {/* Options */}
        {opts.length > 0 && (
          <View style={styles.optionsGap}>
            {opts.map(([key, val]) => (
              <TouchableOpacity
                key={key}
                onPress={() => !checked && setSelected(key)}
                activeOpacity={0.8}
                disabled={checked}
              >
                <View style={[styles.optionCard, {
                  backgroundColor: optionColor(key) + (checked ? 'CC' : '33'),
                  borderColor: optionBorder(key),
                }]}>
                  <View style={[styles.optionKey, {
                    backgroundColor: checked && key === q.answer ? colors.success : checked && key === selected ? colors.error : selected === key ? colors.primary : 'rgba(255,255,255,0.08)',
                  }]}>
                    <Text style={styles.optionKeyText}>{key}</Text>
                  </View>
                  <Text style={styles.optionText}>{val}</Text>
                  {checked && key === q.answer && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
                  {checked && key === selected && key !== q.answer && <Ionicons name="close-circle" size={20} color={colors.error} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Explanation */}
        <Animated.View style={explStyle}>
          <GlassCard style={styles.explCard}>
            <View style={styles.explHeader}>
              <Ionicons name={selected === q.answer ? 'checkmark-circle' : 'close-circle'} size={20} color={selected === q.answer ? colors.success : colors.error} />
              <Text style={[styles.explTitle, { color: selected === q.answer ? colors.success : colors.error }]}>
                {selected === q.answer ? 'Correct!' : `Correct answer: ${q.answer}`}
              </Text>
            </View>
            <Text style={styles.explText}>{q.explanation}</Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>

      {/* Bottom action */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {!checked ? (
          <TouchableOpacity onPress={check} activeOpacity={0.85} disabled={!selected}>
            <LinearGradient
              colors={selected ? ['#6366f1', '#8b5cf6'] : ['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.3)']}
              style={styles.checkBtn}
            >
              <Text style={[styles.checkBtnText, { opacity: selected ? 1 : 0.5 }]}>Check Answer</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={next} activeOpacity={0.85}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.checkBtn}>
              <Text style={styles.checkBtnText}>{idx >= questions.length - 1 ? 'See Results' : 'Next Question'}</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function diffColor(d: string) {
  if (d === 'easy')   return colors.success;
  if (d === 'medium') return colors.warning;
  return colors.error;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  timerText: { fontSize: 13, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, gap: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  sectionBadge: { backgroundColor: 'rgba(99,102,241,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  topicBadge: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  qCard: { padding: 20 },
  questionText: { fontSize: 16, color: 'white', lineHeight: 25, fontWeight: '500' },
  optionsGap: { gap: 10 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 14, borderWidth: 1,
  },
  optionKey: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  optionKeyText: { fontSize: 13, fontWeight: '700', color: 'white' },
  optionText: { flex: 1, fontSize: 14, color: 'white', lineHeight: 20 },
  explCard: { padding: 16, gap: 10 },
  explHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  explTitle: { fontSize: 14, fontWeight: '700' },
  explText: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 20 },
  bottomBar: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: 'rgba(10,10,15,0.8)' },
  checkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  checkBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});
