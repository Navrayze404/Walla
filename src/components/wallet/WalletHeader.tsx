import {
  Bell,
  ChevronDown,
  History,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export function WalletHeader() {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.walletSelector}
        accessibilityRole="button"
        accessibilityLabel="Select wallet"
      >
        <Text style={styles.walletName}>Wallet 1</Text>

      
      </Pressable>

      <Text style={styles.title}>Home</Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Transaction history"
        >
          <History
            size={24}
            color={colors.text}
            strokeWidth={1.8}
          />
        </Pressable>

        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Bell
            size={24}
            color={colors.text}
            strokeWidth={1.8}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  walletSelector: {
    position: 'absolute',
    left: 0,

    height: 40,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: spacing.sm,
    gap: spacing.xs,

    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },

  walletName: {
    ...typography.label,
    color: colors.text,
    padding: 8
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
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
    borderRadius: 24,
  },
});