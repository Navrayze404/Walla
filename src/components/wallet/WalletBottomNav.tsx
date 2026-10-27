import {
  ChartNoAxesCombined,
  House,
  MessageCircle,
  Phone,
} from 'lucide-react-native';
import {
  Animated,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useEffect, useRef } from 'react';

import { GlassCard } from '../common/GlassCard';
import { colors, spacing } from '../../theme';

type WalletBottomNavProps = {
  activeTab:
    | 'home'
    | 'chat'
    | 'activity'
    | 'calls';
  onHomePress: () => void;
  onChatPress: () => void;
  onActivityPress: () => void;
  onCallsPress: () => void;
};

const items = [
  {
    key: 'home',
    icon: House,
  },
  {
    key: 'chat',
    icon: MessageCircle,
  },
  {
    key: 'activity',
    icon: ChartNoAxesCombined,
  },
  {
    key: 'calls',
    icon: Phone,
  },
] as const;

const ITEM_WIDTH = 52;
const ITEM_GAP = spacing.xs;

type TabKey = (typeof items)[number]['key'];

export function WalletBottomNav({
  activeTab,
  onHomePress,
  onChatPress,
  onActivityPress,
  onCallsPress,
}: WalletBottomNavProps) {
  const activeIndex = Math.max(
    0,
    items.findIndex(
      (item) => item.key === activeTab,
    ),
  );

  const indicatorX = useRef(
    new Animated.Value(
      activeIndex *
        (ITEM_WIDTH + ITEM_GAP),
    ),
  ).current;

  const iconScales = useRef(
    items.reduce(
      (acc, item, index) => {
        acc[item.key] = new Animated.Value(
          index === activeIndex ? 1.08 : 1,
        );

        return acc;
      },
      {} as Record<
        TabKey,
        Animated.Value
      >,
    ),
  ).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue:
        activeIndex *
        (ITEM_WIDTH + ITEM_GAP),
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();

    items.forEach((item, index) => {
      Animated.spring(
        iconScales[item.key],
        {
          toValue:
            index === activeIndex
              ? 1.08
              : 1,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        },
      ).start();
    });
  }, [
    activeIndex,
    indicatorX,
    iconScales,
  ]);

  const handlers = {
    home: onHomePress,
    chat: onChatPress,
    activity: onActivityPress,
    calls: onCallsPress,
  };

  return (
    <GlassCard style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeIndicator,
          {
            transform: [
              {
                translateX: indicatorX,
              },
            ],
          },
        ]}
      />

      {items.map((item) => {
        const active =
          activeTab === item.key;

        const Icon = item.icon;

        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={item.key}
            accessibilityState={{
              selected: active,
            }}
            onPress={handlers[item.key]}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    scale:
                      iconScales[item.key],
                  },
                ],
              }}
            >
              <Icon
                size={23}
                color={
                  active
                    ? colors.primary
                    : colors.textMuted
                }
                strokeWidth={
                  active ? 2.2 : 1.8
                }
              />
            </Animated.View>
          </Pressable>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    height: 68,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ITEM_GAP,
  },

  activeIndicator: {
    position: 'absolute',
    left: spacing.sm,
    width: ITEM_WIDTH,
    height: 46,
    borderRadius: 16,
    backgroundColor:
      'rgba(16, 185, 129, 0.14)',
  },

  item: {
    width: ITEM_WIDTH,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },

  pressed: {
    opacity: 0.6,
  },
});