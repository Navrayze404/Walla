import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  QrCode,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type WalletActionType = 'send' | 'receive' | 'swap' | 'scan';

type WalletActionProps = {
  label: string;
  type: WalletActionType;
  onPress: () => void;
};

const icons = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  swap: ArrowLeftRight,
  scan: QrCode,
};

export function WalletAction({
  label,
  type,
  onPress,
}: WalletActionProps) {
  const Icon = icons[type];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.iconContainer}>
        <Icon
          size={32}
          color={colors.text}
          strokeWidth={1.8}
        />
      </View>

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },

  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
  },

  pressed: {
    opacity: 0.7,
  },
});