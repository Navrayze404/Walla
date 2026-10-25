import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export function WalletHeader() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.walletSelector}>
        <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.text} />
        <Text style={styles.walletName}>Wallet 1</Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>

      <Text style={styles.title}>Home</Text>

      <View style={styles.actions}>
        <Pressable style={styles.iconButton} accessibilityLabel="Activity">
          <MaterialCommunityIcons name="history" size={22} color={colors.text} />
        </Pressable>
        <Pressable style={styles.iconButton} accessibilityLabel="Scan QR code">
          <MaterialCommunityIcons name="qrcode-scan" size={22} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 56,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  walletSelector: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button * 2,
  },

  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },

  actions: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    gap: spacing.xs,
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  walletName: {
  ...typography.label,
  color: colors.text,
},
});