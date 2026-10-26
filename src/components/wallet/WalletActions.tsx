import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { WalletAction } from './WalletAction';

export function WalletActions() {
  return (
    <View style={styles.container}>
      <WalletAction
        label="Send"
        type="send"
        onPress={() => {}}
      />

      <WalletAction
        label="Receive"
        type="receive"
        onPress={() => {}}
      />

      <WalletAction
        label="Swap"
        type="swap"
        onPress={() => {}}
      />

      <WalletAction
        label="Scan"
        type="scan"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 20,

    padding: spacing.md,

    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: radius.card,
  },
});