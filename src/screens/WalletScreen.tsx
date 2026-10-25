import { ScrollView, StyleSheet, View } from 'react-native';
import {
  BalanceCard,
  WalletHeader,
  WalletActions,
  TokenList,
  WalletBottomNav,
} from '../components/wallet';
import { colors, spacing } from '../theme';

export function WalletScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <WalletHeader />

        <BalanceCard balance="$1,800,811.10" />

        <WalletActions />

        <TokenList />
      </ScrollView>

      <WalletBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingTop: 40,
    paddingBottom: 120,
  },
});