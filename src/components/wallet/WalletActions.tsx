import { View, StyleSheet } from 'react-native';
import { WalletAction } from './WalletAction';
import { spacing } from '../../theme';

export function WalletActions() {
  return (
    <View style={styles.container}>
      <WalletAction label="Send" icon="send" onPress={() => {}} />
      <WalletAction
        label="Receive"
        icon="arrow-down-circle-outline"
        onPress={() => {}}
      />
      <WalletAction
        label="Swap"
        icon="swap-horizontal"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
});