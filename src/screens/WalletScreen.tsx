import { useState } from 'react';
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
  const [actionsOpen, setActionsOpen] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <WalletHeader />

        <View style={styles.balanceSection}>
          <BalanceCard
            balance="$1,800,811"
            change="+23.1%"
            actionsOpen={actionsOpen}
            onToggleActions={() => setActionsOpen((open) => !open)}
          />

          {actionsOpen && (
            <WalletActions />
          )}
        </View>

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
    paddingTop: 32,
    paddingBottom: 110,
  },

  balanceSection: {
    marginTop: -9,
  },
});