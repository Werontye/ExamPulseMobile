import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'MockExam'>;
type Route = RouteProp<RootStackParamList, 'MockExam'>;

const EXAMS: Record<string, { title: string; subtitle: string; duration: string; total: number; sections: { name: string; questions: number; time: string; color: string; icon: string }[] }> = {
  'sat-1': {
    title: 'SAT Full Mock Test',
    subtitle: 'Digital SAT · Official Format',
    duration: '2h 14min',
    total: 98,
    sections: [
      { name: 'Reading & Writing Module 1', questions: 27, time: '32 min', color: colors.primary, icon: 'book-outline'    },
      { name: 'Reading & Writing Module 2', questions: 27, time: '32 min', color: colors.purple,  icon: 'pencil-outline'  },
      { name: 'Math Module 1',              questions: 22, time: '35 min', color: colors.cyan,    icon: 'calculator-outline' },
      { name: 'Math Module 2',              questions: 22, time: '35 min', color: colors.success, icon: 'stats-chart-outline' },
    ],
  },
  'ielts-1': {
    title: 'IELTS Academic Mock Test',
    subtitle: 'Full Paper · Official Format',
    duration: '2h 45min',
    total: 80,
    sections: [
      { name: 'Listening',  questions: 40, time: '30 min',  color: colors.cyan,    icon: 'headset-outline'  },
      { name: 'Reading',    questions: 40, time: '60 min',  color: colors.primary, icon: 'book-outline'     },
      { name: 'Writing',    questions: 2,  time: '60 min',  color: colors.purple,  icon: 'pencil-outline'   },
      { name: 'Speaking',   questions: 3,  time: '15 min',  color: colors.success, icon: 'mic-outline'      },
    ],
  },
};

export function MockExamScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const insets     = useSafeAreaInsets();
  const exam       = EXAMS[route.params.id] ?? EXAMS['sat-1'];

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mock Exam</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}>
        {/* Hero */}
        <GlassCard style={styles.heroCard} glow>
          <LinearGradient colors={['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.1)']} style={styles.heroGrad}>
            <Ionicons name="trophy-outline" size={40} color={colors.primary} />
            <Text style={styles.heroTitle}>{exam.title}</Text>
            <Text style={styles.heroSub}>{exam.subtitle}</Text>
            <View style={styles.heroStats}>
              <Stat icon="time-outline"      value={exam.duration}     label="Duration"  />
              <Stat icon="help-circle-outline" value={`${exam.total}`} label="Questions" />
              <Stat icon="star-outline"      value="Official"          label="Format"    />
            </View>
          </LinearGradient>
        </GlassCard>

        {/* Sections */}
        <Text style={styles.sectionTitle}>Sections</Text>
        <View style={{ gap: 10 }}>
          {exam.sections.map((sec, i) => (
            <GlassCard key={i} style={styles.sectionCard}>
              <View style={[styles.sectionNum, { backgroundColor: sec.color + '22' }]}>
                <Ionicons name={sec.icon as any} size={18} color={sec.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secName}>{sec.name}</Text>
                <Text style={styles.secDetails}>{sec.questions} questions · {sec.time}</Text>
              </View>
              <View style={[styles.numBadge, { backgroundColor: sec.color + '22' }]}>
                <Text style={[styles.numBadgeText, { color: sec.color }]}>{i + 1}</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Info */}
        <GlassCard style={styles.infoCard}>
          {[
            { icon: 'information-circle-outline', text: 'No breaks between sections' },
            { icon: 'calculator-outline',         text: 'Calculator allowed on Math sections' },
            { icon: 'phone-portrait-outline',     text: 'Keep device unlocked during the exam' },
          ].map((info, i) => (
            <View key={i} style={styles.infoRow}>
              <Ionicons name={info.icon as any} size={16} color={colors.warning} />
              <Text style={styles.infoText}>{info.text}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Start button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Quiz', { id: route.params.id })}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.startBtn}>
            <Ionicons name="flash" size={20} color="white" />
            <Text style={styles.startBtnText}>Start Exam</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Ionicons name={icon as any} size={18} color={colors.primary} />
      <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>{value}</Text>
      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
  scroll: { paddingHorizontal: 16, gap: 16 },
  heroCard: { overflow: 'hidden' },
  heroGrad: { padding: 24, alignItems: 'center', gap: 10 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: 'white', textAlign: 'center' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  heroStats: { flexDirection: 'row', gap: 32, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
  sectionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  sectionNum: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secName: { fontSize: 13, fontWeight: '600', color: 'white' },
  secDetails: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  numBadge: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  numBadgeText: { fontSize: 12, fontWeight: '700' },
  infoCard: { padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18, borderRadius: 18 },
  startBtnText: { fontSize: 17, fontWeight: '700', color: 'white' },
});
