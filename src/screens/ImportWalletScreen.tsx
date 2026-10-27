import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { importWallet } from '../services/wallet';
import { colors, radius, spacing, typography } from '../theme';

type ImportWalletScreenProps = {
  onImported: () => void;
  onBack?: () => void;
};

export function ImportWalletScreen({
  onImported,
  onBack,
}: ImportWalletScreenProps) {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    try {
      setError('');
      setLoading(true);

      const result = await importWallet(
        undefined,
        seedPhrase,
      );

      console.log(
        'IMPORTED WALLET:',
        result.address,
      );

      onImported();
    } catch (error) {
      console.error(
        'Failed to import wallet:',
        error,
      );

      setError('Seed phrase tidak valid');
    } finally {
      setLoading(false);
    }
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
          Import Wallet
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your wallet seed phrase to import
          an existing wallet.
        </Text>

        <TextInput
          value={seedPhrase}
          onChangeText={setSeedPhrase}
          placeholder="Enter seed phrase"
          placeholderTextColor={colors.textMuted}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable
          onPress={handleImport}
          disabled={loading || !seedPhrase.trim()}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
            (loading || !seedPhrase.trim()) &&
              styles.disabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Importing...'
              : 'Import Wallet'}
          </Text>
        </Pressable>
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

  input: {
    minHeight: 140,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    color: colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
  },

  error: {
    marginTop: spacing.sm,
    color: '#EF4444',
    fontSize: 14,
  },

  button: {
    marginTop: spacing.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },
});