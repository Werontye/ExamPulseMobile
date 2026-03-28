import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate,
  runOnJS, Easing,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';

const { width: W } = Dimensions.get('window');

const CARDS = [
  { word: 'ubiquitous',    pronunciation: '/juːˈbɪkwɪtəs/',  definition: 'Present, appearing, or found everywhere.',                                         example: 'Mobile phones have become ubiquitous in modern society.' },
  { word: 'ephemeral',     pronunciation: '/ɪˈfemərəl/',     definition: 'Lasting for a very short time.',                                                    example: 'The ephemeral beauty of cherry blossoms attracts millions of visitors.' },
  { word: 'meticulous',    pronunciation: '/mɪˈtɪkjʊləs/',   definition: 'Showing great attention to detail; very careful and precise.',                       example: 'She was meticulous in her research, checking every source twice.' },
  { word: 'ambiguous',     pronunciation: '/æmˈbɪɡjuəs/',    definition: 'Open to more than one interpretation; not having one obvious meaning.',              example: 'The contract contained several ambiguous clauses.' },
  { word: 'pragmatic',     pronunciation: '/præɡˈmætɪk/',    definition: 'Dealing with things sensibly and realistically.',                                    example: 'A pragmatic approach to problem-solving is often more effective than an idealistic one.' },
  { word: 'mitigate',      pronunciation: '/ˈmɪtɪɡeɪt/',     definition: 'To make less severe, serious, or painful.',                                          example: 'Governments must act to mitigate the effects of climate change.' },
  { word: 'proliferate',   pronunciation: '/prəˈlɪfəreɪt/',  definition: 'To increase rapidly in number; multiply.',                                           example: 'Social media platforms have proliferated over the past decade.' },
  { word: 'tenacious',     pronunciation: '/tɪˈneɪʃəs/',     definition: 'Holding firmly to a position; not giving up easily.',                                example: 'Her tenacious spirit helped her overcome every obstacle.' },
  { word: 'eloquent',      pronunciation: '/ˈeləkwənt/',     definition: 'Fluent or persuasive in speaking or writing.',                                       example: 'The speaker gave an eloquent defence of human rights.' },
  { word: 'disparate',     pronunciation: '/ˈdɪspərət/',     definition: 'Essentially different; not able to be compared.',                                    example: 'The study drew on disparate fields including biology and economics.' },
  { word: 'innate',        pronunciation: '/ɪˈneɪt/',        definition: 'Inborn; natural; not learned.',                                                      example: 'Children have an innate ability to acquire language.' },
  { word: 'unprecedented', pronunciation: '/ʌnˈpresɪdentɪd/', definition: 'Never done or known before.',                                                     example: 'The pandemic caused unprecedented disruption to global supply chains.' },
];

export function FlashcardsScreen() {
  const navigation = useNavigation<any>();
  const insets     = useSafeAreaInsets();

  const [cardIdx,   setCardIdx]   = useState(0);
  const [flipped,   setFlipped]   = useState(false);
  const [known,     setKnown]     = useState<number[]>([]);
  const [review,    setReview]    = useState<number[]>([]);
  const [finished,  setFinished]  = useState(false);

  const flipAnim = useSharedValue(0);
  const swipeX   = useSharedValue(0);
  const swipeO   = useSharedValue(1);

  const card = CARDS[cardIdx];

  const flip = () => {
    if (flipped) {
      flipAnim.value = withTiming(0, { duration: 350, easing: Easing.inOut(Easing.cubic) });
    } else {
      flipAnim.value = withTiming(1, { duration: 350, easing: Easing.inOut(Easing.cubic) });
    }
    setFlipped(f => !f);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const afterSwipe = (kn: boolean) => {
    if (cardIdx >= CARDS.length - 1) {
      setFinished(true);
    } else {
      setCardIdx(i => i + 1);
      setFlipped(false);
      flipAnim.value = 0;
      swipeX.value   = 0;
      swipeO.value   = withTiming(1, { duration: 300 });
    }
  };

  const nextCard = (kn: boolean) => {
    if (kn) setKnown(k => [...k, cardIdx]);
    else    setReview(r => [...r, cardIdx]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swipeO.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(afterSwipe)(kn);
    });
  };

  const frontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipAnim.value, [0, 0.5, 0.5, 1], [1, 0, 0, 0]),
    transform: [{ rotateY: `${interpolate(flipAnim.value, [0, 1], [0, 180])}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipAnim.value, [0, 0.5, 0.5, 1], [0, 0, 1, 1]),
    transform: [{ rotateY: `${interpolate(flipAnim.value, [0, 1], [180, 360])}deg` }],
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  }));
  const cardAnim = useAnimatedStyle(() => ({
    opacity: swipeO.value,
    transform: [{ translateX: swipeX.value }],
  }));

  if (finished) return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 }]}>
      <AnimatedBackground />
      <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.finishIcon}>
        <Ionicons name="trophy" size={40} color="white" />
      </LinearGradient>
      <Text style={styles.finishTitle}>Deck Complete!</Text>
      <View style={styles.finishStats}>
        <View style={styles.finishStat}>
          <Text style={[styles.finishStatVal, { color: colors.success }]}>{known.length}</Text>
          <Text style={styles.finishStatLabel}>Know It</Text>
        </View>
        <View style={styles.finishStat}>
          <Text style={[styles.finishStatVal, { color: colors.warning }]}>{review.length}</Text>
          <Text style={styles.finishStatLabel}>Review</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => { setCardIdx(0); setFlipped(false); setKnown([]); setReview([]); setFinished(false); flipAnim.value = 0; swipeO.value = 1; }} activeOpacity={0.85}>
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.restartBtn}>
          <Ionicons name="refresh" size={18} color="white" />
          <Text style={styles.restartBtnText}>Restart Deck</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.homeLink}>
        <Text style={styles.homeLinkText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Flashcards</Text>
          <Text style={styles.headerSub}>{cardIdx + 1} / {CARDS.length}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressBarWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((cardIdx + 1) / CARDS.length) * 100}%` }]} />
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        <Animated.View style={[styles.cardWrap, cardAnim]}>
          <TouchableOpacity onPress={flip} activeOpacity={1} style={styles.cardTouch}>
            {/* Front */}
            <Animated.View style={[styles.flashCard, frontStyle]}>
              <LinearGradient colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.05)']} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.cardHint}>TAP TO REVEAL</Text>
              <Text style={styles.cardWord}>{card.word}</Text>
              <Text style={styles.cardPron}>{card.pronunciation}</Text>
              <Ionicons name="sync-outline" size={20} color="rgba(255,255,255,0.2)" style={{ marginTop: 8 }} />
            </Animated.View>
            {/* Back */}
            <Animated.View style={[styles.flashCard, backStyle]}>
              <LinearGradient colors={['rgba(6,182,212,0.15)', 'rgba(59,130,246,0.05)']} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.cardDefinition}>{card.definition}</Text>
              <View style={styles.exampleBox}>
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.exampleText}>"{card.example}"</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Swipe buttons */}
      <View style={[styles.swipeButtons, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity onPress={() => nextCard(false)} style={styles.reviewBtn} activeOpacity={0.8}>
          <Ionicons name="close" size={28} color={colors.error} />
          <Text style={[styles.swipeBtnLabel, { color: colors.error }]}>Review</Text>
        </TouchableOpacity>
        <Text style={styles.swipeHint}>Swipe or tap buttons</Text>
        <TouchableOpacity onPress={() => nextCard(true)} style={styles.knowBtn} activeOpacity={0.8}>
          <Ionicons name="checkmark" size={28} color={colors.success} />
          <Text style={[styles.swipeBtnLabel, { color: colors.success }]}>Know It</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  progressBarWrap: { paddingHorizontal: 16, marginBottom: 8 },
  progressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 3, backgroundColor: colors.primary, borderRadius: 2 },
  cardArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  cardWrap: { width: '100%' },
  cardTouch: { width: '100%' },
  flashCard: {
    width: '100%', minHeight: 280, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
    padding: 28, gap: 12, overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardHint: { fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, fontWeight: '700' },
  cardWord: { fontSize: 38, fontWeight: '900', color: 'white', textAlign: 'center' },
  cardPron: { fontSize: 16, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' },
  cardDefinition: { fontSize: 18, color: 'white', textAlign: 'center', lineHeight: 27, fontWeight: '500' },
  exampleBox: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 14, gap: 6, width: '100%' },
  exampleLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: '700', letterSpacing: 1 },
  exampleText: { fontSize: 14, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', lineHeight: 20 },
  swipeButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, paddingTop: 16 },
  reviewBtn: { alignItems: 'center', gap: 4, padding: 12, backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: 20, minWidth: 72 },
  knowBtn:   { alignItems: 'center', gap: 4, padding: 12, backgroundColor: 'rgba(16,185,129,0.12)',  borderRadius: 20, minWidth: 72 },
  swipeBtnLabel: { fontSize: 12, fontWeight: '700' },
  swipeHint: { fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' },
  finishIcon: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  finishTitle: { fontSize: 28, fontWeight: '800', color: 'white' },
  finishStats: { flexDirection: 'row', gap: 48 },
  finishStat: { alignItems: 'center', gap: 6 },
  finishStatVal: { fontSize: 36, fontWeight: '900' },
  finishStatLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  restartBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
  restartBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  homeLink: { paddingVertical: 8 },
  homeLinkText: { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
});
