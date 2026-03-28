import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glow?: boolean;
  disabled?: boolean;
  borderRadius?: number;
}

export function GlassCard({
  children,
  style,
  onPress,
  glow = false,
  disabled = false,
  borderRadius = 20,
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 400 });
  };

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        { borderRadius },
        glow && styles.glow,
        style,
        animStyle,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass.bg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    overflow: 'hidden',
  },
  glow: {
    borderColor: 'rgba(99,102,241,0.3)',
  },
});
