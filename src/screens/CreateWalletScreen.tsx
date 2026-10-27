import { ArrowLeft, Check } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createWallet } from '../services/wallet';
import { colors, radius, spacing, typography } from '../theme';

type CreateWalletScreenProps = {
  onCreated: () => void;
  onBack: () => void;
};

export function CreateWalletScreen({
  onCreated,
  onBack,
}: CreateWalletScreenProps) {
  const [mnemonic, setMnemonic] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);

      const wallet = await createWallet();

      if (!wallet.mnemonic) {
        throw new Error('Seed phrase tidak tersedia');
      }

      setMnemonic(wallet.mnemonic);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!confirmed) return;

    onCreated();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft
            size={24}
            color={colors.text}
            strokeWidth={1.8}
          />
        </Pressable>

        <Text style={styles.title}>
          Create Wallet
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {!mnemonic ? (
          <>
            <Text style={styles.description}>
              Create a new wallet and securely store
              your seed phrase.
            </Text>

            <Pressable
              onPress={handleCreate}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading
                  ? 'Creating...'
                  : 'Create wallet'}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Write down your seed phrase and keep it
              somewhere safe. You will need it to
              recover your wallet.
            </Text>

            <View style={styles.seedCard}>
              <Text style={styles.seedPhrase}>
                {mnemonic}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                setConfirmed((value) => !value)
              }
              style={styles.confirmRow}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: confirmed,
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  confirmed && styles.checkboxActive,
                ]}
              >
                {confirmed && (
                  <Check
                    size={16}
                    color={colors.text}
                    strokeWidth={2.5}
                  />
                )}
              </View>

              <Text style={styles.confirmText}>
                I have securely saved my seed phrase
              </Text>
            </Pressable>

            <Pressable
              onPress={handleContinue}
              disabled={!confirmed}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                !confirmed && styles.disabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                Continue
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    position: 'relative',
    height: 56,
    marginTop: 32,
    marginHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  headerSpacer: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
  },

  content: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
  },

  description: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  seedCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },

  seedPhrase: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },

  confirmRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
  },

  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  confirmText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },

  primaryButton: {
    marginTop: spacing.lg,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },

  primaryButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },
});