import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  countdown?: boolean; // reverse direction for timers
}

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color = colors.primary,
  label,
  showValue = true,
  countdown = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = withTiming(progress, {
      duration: countdown ? 0 : 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (circumference * animProgress.value) / 100,
  }));

  const displayValue = useDerivedValue(() =>
    Math.round(animProgress.value).toString()
  );

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      {showValue && (
        <View style={styles.center}>
          <Animated.Text style={[styles.value, { color, fontSize: size * 0.22 }]}>
            {displayValue}
          </Animated.Text>
          {label ? (
            <Text style={[styles.label, { fontSize: size * 0.1 }]}>{label}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  value: { fontWeight: '700' },
  label: { color: 'rgba(255,255,255,0.5)', marginTop: 2 },
});
