import {
  ArrowLeft,
  Eye,
  Gem,
  Heart,
  Hexagon,
  Pencil,
  Shield,
  Star,
  TriangleAlert,
  User,
  WalletCards,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import {
  colors,
  radius,
  spacing,
  typography,
} from '../theme';

import {
  getWalletSeedPhrase,
  updateWalletName,
  type WalletIcon,
} from '../services/wallet';

type ManageAccountScreenProps = {
  walletId: string;
  walletName: string;
  walletIcon?: WalletIcon;
  onBack: () => void;
  onEditIcon: () => void;
  onNameChanged: (name: string) => void;
};

const iconComponents = {
  wallet: WalletCards,
  user: User,
  shield: Shield,
  gem: Gem,
  star: Star,
  heart: Heart,
  hexagon: Hexagon,
};

export function ManageAccountScreen({
  walletId,
  walletName,
  walletIcon = 'wallet',
  onBack,
  onEditIcon,
  onNameChanged,
}: ManageAccountScreenProps) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(walletName);
  const [savingName, setSavingName] = useState(false);

  const [showSeedWarning, setShowSeedWarning] =
    useState(false);

  const [showSeedPhrase, setShowSeedPhrase] =
    useState(false);

  const [seedPhrase, setSeedPhrase] =
    useState('');

  const [loadingSeedPhrase, setLoadingSeedPhrase] =
    useState(false);

  const Icon =
    walletIcon === 'photo'
      ? WalletCards
      : iconComponents[walletIcon];

  const handleSaveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName || savingName) {
      return;
    }

    try {
      setSavingName(true);

      await updateWalletName(
        walletId,
        trimmedName,
      );

      setName(trimmedName);
      onNameChanged(trimmedName);
      setEditingName(false);
    } catch (error) {
      console.error(
        'Failed to update wallet name:',
        error,
      );
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelName = () => {
    setName(walletName);
    setEditingName(false);
  };

  const handleShowSeedPhrase = async () => {
    if (loadingSeedPhrase) {
      return;
    }

    try {
      setLoadingSeedPhrase(true);

      const phrase =
        await getWalletSeedPhrase(walletId);

      setSeedPhrase(phrase);
      setShowSeedWarning(false);
      setShowSeedPhrase(true);
    } catch (error) {
      console.error(
        'Failed to load seed phrase:',
        error,
      );
    } finally {
      setLoadingSeedPhrase(false);
    }
  };

  const handleCloseSeedPhrase = () => {
    setShowSeedPhrase(false);
    setSeedPhrase('');
  };

  const handleCopySeedPhrase = async () => {
    if (!seedPhrase) {
      return;
    }

    await Clipboard.setStringAsync(seedPhrase);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
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
            Manage account
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Wallet Icon */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Icon
                size={56}
                color={colors.text}
                strokeWidth={1.8}
              />
            </View>

            <Pressable
              onPress={onEditIcon}
              style={styles.editButton}
              accessibilityRole="button"
              accessibilityLabel="Edit wallet icon"
            >
              <Pencil
                size={18}
                color={colors.text}
                strokeWidth={2}
              />
            </Pressable>
          </View>
        </View>

        {/* Wallet Name */}
        <View style={styles.walletNameContainer}>
          {editingName ? (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={30}
                style={styles.walletNameInput}
                placeholder="Wallet name"
                placeholderTextColor={
                  colors.textMuted
                }
                returnKeyType="done"
                onSubmitEditing={
                  handleSaveName
                }
              />

              <View style={styles.nameActions}>
                <Pressable
                  onPress={handleCancelName}
                  style={styles.cancelButton}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel name change"
                >
                  <Text style={styles.cancelText}>
                    ×
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSaveName}
                  disabled={
                    savingName ||
                    !name.trim()
                  }
                  style={[
                    styles.saveButton,
                    (savingName ||
                      !name.trim()) &&
                      styles.saveButtonDisabled,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Save wallet name"
                >
                  <Text style={styles.saveText}>
                    Save
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Pressable
                onPress={() =>
                  setEditingName(true)
                }
                style={styles.namePressable}
                accessibilityRole="button"
                accessibilityLabel="Edit wallet name"
              >
                <Text
                  style={styles.walletName}
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  setEditingName(true)
                }
                style={styles.nameEditButton}
                accessibilityRole="button"
                accessibilityLabel="Edit wallet name"
              >
                <Pencil
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={1.8}
                />
              </Pressable>
            </>
          )}
        </View>

        {/* Seed Phrase */}
        <Pressable
          onPress={() =>
            setShowSeedWarning(true)
          }
          style={({ pressed }) => [
            styles.seedPhraseCard,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Show seed phrase"
        >
          <View style={styles.seedPhraseIcon}>
            <Eye
              size={24}
              color={colors.secondary}
              strokeWidth={1.8}
            />
          </View>

          <View style={styles.seedPhraseText}>
            <Text style={styles.seedPhraseTitle}>
              Show Seed Phrase
            </Text>

            <Text style={styles.seedPhraseSubtitle}>
              Reveal your recovery phrase
            </Text>
          </View>

          <View style={styles.seedPhraseArrow}>
            <Text style={styles.seedPhraseArrowText}>
              ›
            </Text>
          </View>
        </Pressable>

        {/* Warning */}
        <View style={styles.warning}>
          <View style={styles.warningIcon}>
            <TriangleAlert
              size={20}
              color="#F87171"
              strokeWidth={2}
            />
          </View>

          <Text style={styles.warningText}>
            Keep your seed phrase private. Anyone
            with access to it can control your wallet.
          </Text>
        </View>
      </View>

      {/* Remove */}
      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Remove account"
        >
          <Text style={styles.removeText}>
            Remove account
          </Text>
        </Pressable>
      </View>

      {/* Seed Phrase Warning */}
      {showSeedWarning && (
        <View style={styles.warningOverlay}>
          <View style={styles.warningModal}>
            <View style={styles.warningModalIcon}>
              <TriangleAlert
                size={28}
                color="#F87171"
                strokeWidth={1.8}
              />
            </View>

            <Text style={styles.warningModalTitle}>
              Protect your Seed Phrase
            </Text>

            <Text style={styles.warningModalText}>
              Your Seed Phrase gives full access to
              your wallet. Anyone who has it can
              control your funds.
            </Text>

            <Text style={styles.warningModalText}>
              Never share it, screenshot it, or enter
              it into a website or app you don't trust.
            </Text>

            <Text style={styles.warningModalQuestion}>
              Make sure no one can see your screen.
            </Text>

            <View style={styles.warningModalActions}>
              <Pressable
                onPress={() =>
                  setShowSeedWarning(false)
                }
                style={styles.warningCancelButton}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.warningCancelText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleShowSeedPhrase}
                disabled={loadingSeedPhrase}
                style={[
                  styles.warningContinueButton,
                  loadingSeedPhrase &&
                    styles.saveButtonDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Continue to seed phrase"
              >
                <Text style={styles.warningContinueText}>
                  {loadingSeedPhrase
                    ? 'Loading...'
                    : 'Continue'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Seed Phrase Reveal */}
      {showSeedPhrase && (
        <View style={styles.warningOverlay}>
          <View style={styles.seedModal}>
            <View style={styles.seedModalHeader}>
              <Text style={styles.seedModalTitle}>
                Your Seed Phrase
              </Text>

              <Pressable
                onPress={handleCloseSeedPhrase}
                style={styles.seedCloseButton}
                accessibilityRole="button"
                accessibilityLabel="Close seed phrase"
              >
                <Text style={styles.seedCloseText}>
                  ×
                </Text>
              </Pressable>
            </View>

            <Text style={styles.seedModalSubtitle}>
              Write these words down and store them
              somewhere safe. Do not share them with
              anyone.
            </Text>

            <View style={styles.seedPhraseBox}>
              {seedPhrase
                .split(' ')
                .map((word, index) => (
                  <View
                    key={`${word}-${index}`}
                    style={styles.seedWord}
                  >
                    <Text style={styles.seedWordNumber}>
                      {index + 1}
                    </Text>

                    <Text
                      style={styles.seedWordText}
                      numberOfLines={1}
                    >
                      {word}
                    </Text>
                  </View>
                ))}
            </View>

            <Pressable
              onPress={handleCopySeedPhrase}
              style={styles.copyButton}
              accessibilityRole="button"
              accessibilityLabel="Copy seed phrase"
            >
              <Text style={styles.copyButtonText}>
                Copy Seed Phrase
              </Text>
            </Pressable>

            <View style={styles.seedFinalWarning}>
              <TriangleAlert
                size={18}
                color="#F87171"
                strokeWidth={1.8}
              />

              <Text style={styles.seedFinalWarningText}>
                Never share your seed phrase with
                anyone. Walla will never ask for it.
              </Text>
            </View>

            <Pressable
              onPress={handleCloseSeedPhrase}
              style={styles.doneButton}
              accessibilityRole="button"
              accessibilityLabel="Done"
            >
              <Text style={styles.doneButtonText}>
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      )}
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
  },

  header: {
    position: 'relative',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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

  headerSpacer: {
    display: 'none',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  avatarSection: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  editButton: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.background,
  },

  walletNameContainer: {
    minHeight: 56,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
  },

  namePressable: {
    flex: 1,
    justifyContent: 'center',
  },

  walletName: {
    ...typography.heading,
    color: colors.text,
  },

  nameEditButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  walletNameInput: {
    flex: 1,
    paddingVertical: 0,
    ...typography.heading,
    color: colors.text,
  },

  nameActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  cancelButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: 20,
  },

  cancelText: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
    color: colors.textMuted,
  },

  saveButton: {
    height: 40,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveText: {
    ...typography.label,
    color: colors.background,
    fontWeight: '600',
  },

  seedPhraseCard: {
    minHeight: 80,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },

  seedPhraseIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172B4D',
    borderRadius: 16,
  },

  seedPhraseText: {
    flex: 1,
    marginLeft: spacing.md,
  },

  seedPhraseTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  seedPhraseSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },

  seedPhraseArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  seedPhraseArrowText: {
    fontSize: 28,
    lineHeight: 30,
    color: colors.textMuted,
    fontWeight: '300',
  },

  warning: {
    marginTop: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#4A292D',
    borderRadius: radius.card,
  },

  warningIcon: {
    paddingTop: 2,
  },

  warningText: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  removeButton: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A292D',
    borderRadius: 32,
  },

  removeText: {
    ...typography.body,
    color: '#F87171',
    fontWeight: '600',
  },

  warningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },

  warningModal: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },

  warningModalIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: '#4A292D',
    borderRadius: 28,
  },

  warningModalTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  warningModalText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },

  warningModalQuestion: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.sm,
  },

  warningModalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  warningCancelButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: radius.button,
  },

  warningCancelText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  warningContinueButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },

  warningContinueText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '700',
  },

  seedModal: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },

  seedModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  seedModalTitle: {
    ...typography.heading,
    color: colors.text,
  },

  seedCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: 20,
  },

  seedCloseText: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
    color: colors.textMuted,
  },

  seedModalSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    marginTop: spacing.md,
  },

  seedPhraseBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },

  seedWord: {
    flexBasis: '31%',
    minWidth: 0,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
  },

  seedWordNumber: {
    width: 20,
    ...typography.caption,
    color: colors.textMuted,
  },

  seedWordText: {
    flex: 1,
    minWidth: 0,
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
  },

  copyButton: {
    height: 48,
    marginTop: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: radius.button,
  },

  copyButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  seedFinalWarning: {
    marginTop: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#4A292D',
    borderRadius: 16,
  },

  seedFinalWarningText: {
    flex: 1,
    ...typography.caption,
    color: colors.text,
    lineHeight: 18,
  },

  doneButton: {
    height: 52,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },

  doneButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.7,
  },
});