import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type BalanceCardProps = {
  balance: string;
  currency?: string;
};

export function BalanceCard({
  balance,
  currency = 'USD',
}: BalanceCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Balance</Text>

      <View style={styles.balanceRow}>
        <Text style={styles.balance}>{balance}</Text>
        <Text style={styles.currency}>{currency}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  balance: {
    ...typography.title,
    color: colors.text,
  },
  currency: {
    ...typography.body,
    color: colors.textMuted,
  },
});