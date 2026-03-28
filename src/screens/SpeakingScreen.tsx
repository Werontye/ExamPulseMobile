import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence,
  withSpring, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { speakingQuestions, SpeakingQuestion } from '../data/speaking-questions';
import { colors } from '../theme/colors';

type Step = 'question' | 'prep' | 'recording' | 'analyzing' | 'result';

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'kind of', 'sort of', 'i mean', 'right', 'okay', 'well'];

function analyzeResponse(transcript: string, durationSec: number) {
  const words = transcript.toLowerCase().split(/\s+/).filter(Boolean);
  const wc = words.length || 1;
  const wpm = wc / Math.max(durationSec / 60, 0.1);
  const fillers = words.filter(w => FILLER_WORDS.includes(w));
  const uniqueWords = new Set(words).size;
  const lexDiv = uniqueWords / wc;
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 3);
  const avgSentLen = wc / Math.max(sentences.length, 1);

  const fluency = Math.min(9, Math.max(1, (wpm / 140) * 9 - fillers.length * 0.4));
  const lexical = Math.min(9, Math.max(1, lexDiv * 13));
  const grammar  = Math.min(9, Math.max(1, avgSentLen / 2.2));
  const pronunc  = Math.min(9, Math.max(1, (fluency + lexical) / 2));
  const overall  = Math.round(((fluency + lexical + grammar + pronunc) / 4) * 2) / 2;

  const tips: string[] = [];
  if (fluency < 6)  tips.push('Try to speak more smoothly — reduce pauses and filler words.');
  if (lexical < 6)  tips.push('Use a wider range of vocabulary to demonstrate lexical resource.');
  if (grammar < 6)  tips.push('Aim for longer, more complex sentences with varied structure.');
  if (pronunc < 6)  tips.push('Focus on clear enunciation and natural rhythm.');
  if (fillers.length > 3) tips.push(`You used ${fillers.length} filler words. Practice replacing them with pauses.`);
  if (tips.length === 0) tips.push('Great response! Keep practising to maintain this level.', 'Try Part 3 questions to challenge your abstract thinking.');

  return { overall, fluency, lexical, grammar, pronunc, wc, wpm: Math.round(wpm), fillers: [...new Set(fillers)], uniqueWords, sentences: sentences.length, tips };
}

function getRandomQuestion(): SpeakingQuestion {
  return speakingQuestions[Math.floor(Math.random() * speakingQuestions.length)];
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function SpeakingScreen() {
  const insets   = useSafeAreaInsets();
  const [step, setStep]           = useState<Step>('question');
  const [question, setQuestion]   = useState<SpeakingQuestion>(getRandomQuestion);
  const [notes, setNotes]         = useState('');
  const [prepLeft, setPrepLeft]   = useState(question.prepTime);
  const [recSec, setRecSec]       = useState(0);
  const [transcript, setTranscript] = useState('');
  const [result, setResult]       = useState<ReturnType<typeof analyzeResponse> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mic pulse animation
  const micScale = useSharedValue(1);
  const micGlow  = useSharedValue(0.6);

  useEffect(() => {
    if (step === 'recording') {
      micScale.value = withRepeat(withSequence(withTiming(1.18, { duration: 700 }), withTiming(1, { duration: 700 })), -1, false);
      micGlow.value  = withRepeat(withSequence(withTiming(1,   { duration: 700 }), withTiming(0.6, { duration: 700 })), -1, false);
      timerRef.current = setInterval(() => setRecSec(s => s + 1), 1000);
    } else {
      micScale.value = withSpring(1);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  // Prep countdown
  useEffect(() => {
    if (step !== 'prep') return;
    if (prepLeft <= 0) { setStep('recording'); return; }
    const t = setTimeout(() => setPrepLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [step, prepLeft]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
    opacity: micGlow.value,
  }));

  const newQuestion = () => {
    const q = getRandomQuestion();
    setQuestion(q);
    setPrepLeft(q.prepTime);
    setNotes(''); setTranscript(''); setResult(null);
    setStep('question'); setRecSec(0);
  };

  const stopRecording = () => {
    setStep('analyzing');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Simulate transcript + analysis after 2s
    setTimeout(() => {
      const mockTranscript = transcript ||
        "I think this is a really important topic. Um, personally I believe that education plays a crucial role in society. You know, it basically shapes how people think and interact with the world around them. I have personally experienced how good education can transform lives and open new opportunities for individuals and communities alike.";
      const r = analyzeResponse(mockTranscript, recSec || 45);
      setTranscript(mockTranscript);
      setResult(r);
      setStep('result');
    }, 2000);
  };

  // ── Render by step ────────────────────────────────────────────────
  if (step === 'question') return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 120 }]}>
        <Text style={styles.pageTitle}>Speaking Practice</Text>
        <GlassCard style={styles.qCard} glow>
          <View style={styles.partBadgeRow}>
            <View style={[styles.partBadge, { backgroundColor: partColor(question.part) + '22' }]}>
              <Text style={[styles.partBadgeText, { color: partColor(question.part) }]}>{question.part}</Text>
            </View>
            <Text style={styles.topicText}>{question.topic}</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.tips && (
            <View style={styles.tipsBox}>
              {question.tips.map((t, i) => (
                <View key={i} style={styles.tipRow}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
                  <Text style={styles.tipText}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>
        <View style={{ gap: 12, marginTop: 8 }}>
          <TouchableOpacity onPress={() => setStep('prep')} activeOpacity={0.85}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.primaryBtn}>
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.primaryBtnText}>Start Preparation</Text>
            </LinearGradient>
          </TouchableOpacity>
          <GlassCard style={styles.outlineBtn} onPress={newQuestion}>
            <Ionicons name="shuffle-outline" size={18} color={colors.primary} />
            <Text style={styles.outlineBtnText}>New Question</Text>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );

  if (step === 'prep') return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 120 }]}>
        <Text style={styles.pageTitle}>Preparation Time</Text>
        <GlassCard style={{ padding: 18, alignItems: 'center', gap: 20 }}>
          <ProgressRing
            progress={(prepLeft / question.prepTime) * 100}
            size={140}
            strokeWidth={10}
            color={prepLeft < 10 ? colors.error : colors.cyan}
            label="sec left"
            countdown
          />
          <Animated.Text style={[styles.prepCountdown, { color: prepLeft < 10 ? colors.error : colors.cyan }]}>
            {prepLeft}s
          </Animated.Text>
          <Text style={styles.prepHint}>Jot down key ideas below</Text>
        </GlassCard>
        <GlassCard style={{ padding: 14, marginTop: 12 }}>
          <TextInput
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Jot down your ideas..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            style={styles.notesInput}
          />
        </GlassCard>
        <TouchableOpacity onPress={() => setStep('recording')} activeOpacity={0.85} style={{ marginTop: 12 }}>
          <GlassCard style={styles.outlineBtn}>
            <Ionicons name="mic" size={18} color={colors.success} />
            <Text style={[styles.outlineBtnText, { color: colors.success }]}>Skip — Start Now</Text>
          </GlassCard>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (step === 'recording') return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: 120, flex: 1, justifyContent: 'center', alignItems: 'center', gap: 32 }]}>
        <Text style={styles.pageTitle}>Recording…</Text>
        <Text style={styles.recTimer}>{fmt(recSec)}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer pulse ring */}
          <Animated.View style={[styles.micOuter, micStyle]} />
          <TouchableOpacity onPress={stopRecording} activeOpacity={0.8} style={styles.micBtn}>
            <Ionicons name="mic" size={48} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.recHint}>Tap the mic to stop recording</Text>
        <GlassCard style={{ padding: 14, width: '90%', minHeight: 80 }}>
          <Text style={styles.transcriptLabel}>Live transcript (simulated)</Text>
          <Text style={styles.transcriptText}>{transcript || 'Start speaking…'}</Text>
        </GlassCard>
      </View>
    </View>
  );

  if (step === 'analyzing') return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', gap: 20 }]}>
      <AnimatedBackground />
      <LoadingSpinner size={56} color={colors.primary} />
      <Text style={styles.analyzingText}>Analysing your response…</Text>
    </View>
  );

  if (step === 'result' && result) return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 120 }]}>
        <Text style={styles.pageTitle}>Your Results</Text>

        {/* Overall Band */}
        <GlassCard style={styles.overallCard} glow>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={styles.overallLabel}>Overall Band Score</Text>
            <Text style={styles.overallScore}>{result.overall.toFixed(1)}</Text>
            <Text style={styles.overallSub}>IELTS Speaking Estimate</Text>
          </View>
          <ProgressRing progress={(result.overall / 9) * 100} size={110} strokeWidth={9} color={bandColor(result.overall)} showValue={false} />
        </GlassCard>

        {/* Criteria */}
        <GlassCard style={{ padding: 16, gap: 14 }}>
          {[
            { label: 'Fluency & Coherence',          score: result.fluency },
            { label: 'Lexical Resource',              score: result.lexical },
            { label: 'Grammatical Range & Accuracy',  score: result.grammar },
            { label: 'Pronunciation (estimated)',      score: result.pronunc },
          ].map((c, i) => (
            <View key={i} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.criteriaLabel}>{c.label}</Text>
                <Text style={[styles.criteriaScore, { color: bandColor(c.score) }]}>{c.score.toFixed(1)}</Text>
              </View>
              <View style={styles.barBg}>
                <Animated.View style={[styles.barFill, { width: `${(c.score / 9) * 100}%`, backgroundColor: bandColor(c.score) }]} />
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Words',   value: result.wc.toString()  },
            { label: 'WPM',     value: result.wpm.toString() },
            { label: 'Fillers', value: result.fillers.length.toString() },
            { label: 'Unique',  value: result.uniqueWords.toString() },
          ].map((s, i) => (
            <GlassCard key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Transcript */}
        {transcript ? (
          <GlassCard style={{ padding: 14 }}>
            <Text style={styles.transcriptLabel}>Your Transcript</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
            {result.fillers.length > 0 && (
              <Text style={styles.fillersLine}>Filler words: {result.fillers.join(', ')}</Text>
            )}
          </GlassCard>
        ) : null}

        {/* Tips */}
        <GlassCard style={{ padding: 16, gap: 10 }}>
          <Text style={styles.tipsTitle}>Improvement Tips</Text>
          {result.tips?.map((t: string, i: number) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="bulb-outline" size={16} color={colors.warning} />
              <Text style={[styles.tipText, { flex: 1 }]}>{t}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity onPress={() => { setStep('question'); setRecSec(0); setTranscript(''); setResult(null); setPrepLeft(question.prepTime); }} activeOpacity={0.85}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.primaryBtn}>
              <Ionicons name="refresh" size={18} color="white" />
              <Text style={styles.primaryBtnText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
          <GlassCard style={styles.outlineBtn} onPress={newQuestion}>
            <Ionicons name="shuffle-outline" size={18} color={colors.primary} />
            <Text style={styles.outlineBtnText}>New Question</Text>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );

  return null;
}

function partColor(part: string) {
  if (part === 'Part 1') return colors.cyan;
  if (part === 'Part 2') return colors.primary;
  return colors.purple;
}
function bandColor(score: number) {
  if (score >= 7) return colors.success;
  if (score >= 5.5) return colors.warning;
  return colors.error;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { paddingHorizontal: 18, gap: 16 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 4 },
  qCard: { padding: 20, gap: 16 },
  partBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  partBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  partBadgeText: { fontSize: 12, fontWeight: '700' },
  topicText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  questionText: { fontSize: 16, color: 'white', lineHeight: 24, fontWeight: '500' },
  tipsBox: { backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: 12, padding: 12, gap: 6 },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: 'white' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 },
  outlineBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  prepCountdown: { fontSize: 48, fontWeight: '800' },
  prepHint: { fontSize: 13, color: 'rgba(255,255,255,0.45)' },
  notesInput: { color: 'white', fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
  recTimer: { fontSize: 48, fontWeight: '800', color: 'white', letterSpacing: 2 },
  micOuter: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(239,68,68,0.25)',
  },
  micBtn: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.error,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.error, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
  },
  recHint: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  transcriptLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 },
  transcriptText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  analyzingText: { fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  overallCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  overallLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  overallScore: { fontSize: 52, fontWeight: '900', color: 'white' },
  overallSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  criteriaLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  criteriaScore: { fontSize: 14, fontWeight: '700' },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: 'white' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  fillersLine: { fontSize: 11, color: colors.warning, marginTop: 8 },
});
