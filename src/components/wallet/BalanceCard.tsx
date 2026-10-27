import {
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useRef } from 'react';

import { GlassCard } from '../common/GlassCard';
import { colors, spacing } from '../../theme';

type BalanceCardProps = {
  balance: string;
  dailyPnl?: string;
  actionsOpen: boolean;
  onToggleActions: () => void;
};

export function BalanceCard({
  balance,
  dailyPnl = '+0.0%',
  actionsOpen,
  onToggleActions,
}: BalanceCardProps) {
  const pnlValue = Number.parseFloat(dailyPnl);
  const isPositive = pnlValue >= 0;

  const pnlColor = isPositive
    ? colors.primary
    : '#F87171';

  const PnlIcon = isPositive
    ? TrendingUp
    : TrendingDown;

  const pnlText = `${Math.abs(
    pnlValue,
  ).toFixed(1)}%`;

  const chevronScale = useRef(
    new Animated.Value(1),
  ).current;

  const indicatorScale = useRef(
    new Animated.Value(
      actionsOpen ? 1 : 0.82,
    ),
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(chevronScale, {
        toValue: 0.7,
        duration: 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(chevronScale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.spring(indicatorScale, {
      toValue: actionsOpen ? 1 : 0.82,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [
    actionsOpen,
    chevronScale,
    indicatorScale,
  ]);

  return (
    <GlassCard style={styles.container}>
      <Text style={styles.label}>
        My Balance
      </Text>

      <Text style={styles.balance}>
        {balance}
      </Text>

      <View style={styles.pnl}>
        <PnlIcon
          size={18}
          color={pnlColor}
          strokeWidth={2}
        />

        <Text
          style={[
            styles.change,
            { color: pnlColor },
          ]}
        >
          {pnlText}
        </Text>
      </View>

      <View style={styles.indicator}>
        <Animated.View
          style={[
            styles.line,
            {
              backgroundColor: actionsOpen
                ? colors.secondary
                : colors.textMuted,
              transform: [
                {
                  scaleX: indicatorScale,
                },
              ],
            },
          ]}
        />

        <Pressable
          onPress={onToggleActions}
          accessibilityRole="button"
          accessibilityLabel={
            actionsOpen
              ? 'Hide wallet actions'
              : 'Show wallet actions'
          }
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: chevronScale,
                },
              ],
            }}
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
          </Animated.View>
        </Pressable>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 125,
    padding: spacing.md,
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

  pnl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  change: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
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
});