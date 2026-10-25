import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', amount: '342.18 ETH', value: '$1,200,000.00' },
  { symbol: 'USDC', name: 'USD Coin', amount: '500,000 USDC', value: '$500,000.00' },
  { symbol: 'SOL', name: 'Solana', amount: '6,420.11 SOL', value: '$100,811.10' },
];

export function TokenList() {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Tokens</Text>
        <Text style={styles.seeAll}>See all ›</Text>
      </View>

      {tokens.map((token) => (
        <View key={token.symbol} style={styles.card}>
          <View>
            <Text style={styles.symbol}>{token.symbol}</Text>
            <Text style={styles.name}>{token.name}</Text>
          </View>

          <View style={styles.balance}>
            <Text style={styles.value}>{token.value}</Text>
            <Text style={styles.amount}>{token.amount}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: { ...typography.heading, color: colors.text },
  seeAll: { ...typography.label, color: colors.secondary },
  card: {
    minHeight: 76,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  symbol: { ...typography.body, color: colors.text, fontWeight: '600' },
  name: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs / 2 },
  balance: { alignItems: 'flex-end', flexShrink: 1 },
  value: { ...typography.body, color: colors.text, fontWeight: '600' },
  amount: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs / 2 },
});