import { useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

type BalanceCardProps = {
  balance: string;
  change?: string;
  actionsOpen: boolean;
  onToggleActions: () => void;
};

export function BalanceCard({
  balance,
  change = '+23.1%',
  actionsOpen,
  onToggleActions,
}: BalanceCardProps) {
  const lineProgress = useSharedValue(actionsOpen ? 1 : 0);

  useEffect(() => {
    lineProgress.value = withTiming(actionsOpen ? 1 : 0, {
      duration: 220,
    });
  }, [actionsOpen, lineProgress]);

  const lineStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      lineProgress.value,
      [0, 1],
      [colors.textMuted, colors.secondary],
    ),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>My Balance</Text>

      <Text style={styles.balance}>{balance}</Text>

      <Text style={styles.change}>{change}</Text>

      <View style={styles.indicator}>
        <Animated.View style={[styles.line, lineStyle]} />

        <Pressable
          style={styles.toggle}
          onPress={onToggleActions}
          accessibilityRole="button"
          accessibilityLabel={
            actionsOpen ? 'Hide wallet actions' : 'Show wallet actions'
          }
        >
          {actionsOpen ? (
            <ChevronUp
              size={20}
              color={colors.text}
              strokeWidth={1.8}
            />
          ) : (
            <ChevronDown
              size={20}
              color={colors.text}
              strokeWidth={1.8}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 125,
    padding: spacing.md,

    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },

  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.textMuted,
    marginBottom: 8,
  },

  balance: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },

  change: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.primary,
  },

  indicator: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.sm,

    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  line: {
    position: 'absolute',
    bottom: -3,
    width: 98,
    height: 2,
  },

  // toggle: {
  //   width: 32,
  //   height: 32,

  //   alignItems: 'center',
  //   justifyContent: 'center',

  //   backgroundColor: colors.surface,
  //   borderWidth: 1,
  //   borderColor: colors.border,
  //   borderRadius: 20,

  //   zIndex: 2,
  // },
});