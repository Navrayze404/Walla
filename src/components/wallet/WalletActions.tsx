import { StyleSheet } from 'react-native';

import { GlassCard } from '../common/GlassCard';
import { spacing } from '../../theme';
import { WalletAction } from './WalletAction';

type WalletActionsProps = {
  onSend: () => void;
};

export function WalletActions({
  onSend,
}: WalletActionsProps) {
  return (
    <GlassCard style={styles.container}>
      <WalletAction
        label="Send"
        type="send"
        onPress={onSend}
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
    </GlassCard>
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
  },
});