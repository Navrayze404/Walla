import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type CreateWalletButtonProps = {
  onPress: () => void;
};

export function CreateWalletButton({
  onPress,
}: CreateWalletButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>Buat Wallet Baru</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...typography.label,
    color: colors.background,
    fontWeight: '600',
  },
});