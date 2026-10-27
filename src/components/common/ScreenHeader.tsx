import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { ReactNode } from 'react';

import { colors, spacing, typography } from '../../theme';

type ScreenHeaderProps = {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function ScreenHeader({
  title,
  left,
  right,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {left}
      </View>

      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.side}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 88,
    paddingTop: 32,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  side: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...typography.title,
    flex: 1,
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});