import {
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
  radius,
  spacing,
} from '../theme';

type SendReviewScreenProps = {
  recipient: string;
  tokenSymbol: string;
  amount: string;
  network: string;
  isSending: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

export function SendReviewScreen({
  recipient,
  tokenSymbol,
  isSending,
  amount,
  network,
  onBack,
  onConfirm,
}: SendReviewScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <ArrowLeft
            size={24}
            color={colors.text}
            strokeWidth={1.8}
          />
        </Pressable>

        <Text style={styles.title}>Review Send</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountSection}>
          <Text style={styles.amount}>
            {amount}
          </Text>

          <Text style={styles.amountToken}>
            {tokenSymbol}
          </Text>
        </View>

        <View style={styles.card}>
          <ReviewRow
            label="Recipient"
            value={formatAddress(recipient)}
          />

          <View style={styles.divider} />

          <ReviewRow
            label="Network"
            value={network}
          />

          <View style={styles.divider} />

          <ReviewRow
            label="Token"
            value={tokenSymbol}
          />
        </View>

        <View style={styles.warning}>
          <CheckCircle2
            size={20}
            color={colors.primary}
            strokeWidth={1.8}
          />

          <Text style={styles.warningText}>
            Pastikan alamat penerima dan jumlah sudah benar.
            Transaksi blockchain tidak dapat dibatalkan.
          </Text>
        </View>

        <Pressable
          onPress={onConfirm}
          disabled={isSending}
          style={[
            styles.confirmButton,
            isSending && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.confirmText}>
            {isSending ? 'Sending...' : 'Confirm & Send'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type ReviewRowProps = {
  label: string;
  value: string;
};

function ReviewRow({
  label,
  value,
}: ReviewRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={styles.value}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function formatAddress(address: string) {
  if (address.length <= 16) {
    return address;
  }

  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 88,
    paddingHorizontal: spacing.md,
    paddingTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },

  amountSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  amount: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '700',
  },

  amountToken: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
  },

  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },

  value: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  warning: {
    marginTop: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  warningText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },

  confirmButton: {
    height: 52,
    marginTop: 'auto',
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },

  confirmButtonPressed: {
    opacity: 0.7,
  },

  confirmText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});