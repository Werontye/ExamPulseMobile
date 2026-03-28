import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

const ORBS = [
  { color: 'rgba(99,102,241,0.25)', size: 320, x: -60, y: -60, duration: 9000 },
  { color: 'rgba(139,92,246,0.18)', size: 260, x: W * 0.5, y: H * 0.2, duration: 11000 },
  { color: 'rgba(6,182,212,0.15)', size: 200, x: W * 0.05, y: H * 0.55, duration: 8000 },
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i / 14) * W + Math.random() * 30,
  delay: i * 700,
  duration: 7000 + (i % 5) * 1000,
}));

function Orb({ orb }: { orb: (typeof ORBS)[0] }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    tx.value = withRepeat(
      withSequence(
        withTiming(20, { duration: orb.duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(-15, { duration: orb.duration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true
    );
    ty.value = withRepeat(
      withSequence(
        withTiming(-18, { duration: orb.duration * 1.1, easing: Easing.inOut(Easing.sin) }),
        withTiming(22, { duration: orb.duration * 0.9, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <Animated.View
      style={[styles.orb, style, {
        width: orb.size, height: orb.size,
        borderRadius: orb.size / 2,
        backgroundColor: orb.color,
        left: orb.x, top: orb.y,
      }]}
    />
  );
}

function Particle({ p }: { p: (typeof PARTICLES)[0] }) {
  const ty = useSharedValue(H + 10);
  const opacity = useSharedValue(0);

  useEffect(() => {
    ty.value = withDelay(p.delay, withRepeat(
      withSequence(
        withTiming(-(H + 10), { duration: p.duration, easing: Easing.linear }),
        withTiming(H + 10, { duration: 0 }),
      ),
      -1
    ));
    opacity.value = withDelay(p.delay, withRepeat(
      withSequence(
        withTiming(0.6, { duration: p.duration * 0.15 }),
        withTiming(0.4, { duration: p.duration * 0.7 }),
        withTiming(0, { duration: p.duration * 0.15 }),
        withTiming(0, { duration: 0 }),
      ),
      -1
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, style, { left: p.x }]} />
  );
}

export function AnimatedBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={styles.base} />
      {ORBS.map((orb, i) => <Orb key={i} orb={orb} />)}
      {PARTICLES.map((p) => <Particle key={p.id} p={p} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0f',
  },
  orb: {
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
