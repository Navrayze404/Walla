import {
  ArrowLeft,
  ChevronDown,
  ScanLine,
} from 'lucide-react-native';

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useState } from 'react';

import {
  colors,
  radius,
  spacing,
} from '../theme';

import type { TokenBalance } from '../types/token';

type SendScreenProps = {
  tokens: TokenBalance[];
  onBack: () => void;
  onContinue: (data: {
    recipient: string;
    tokenSymbol: string;
    amount: string;
    network: string;
  }) => void;
};

export function SendScreen({
  tokens,
  onBack,
  onContinue,
}: SendScreenProps) {
  const [recipient, setRecipient] = useState('');
  const [selectedTokenIndex, setSelectedTokenIndex] =
    useState(0);
  const [amount, setAmount] = useState('');
  const [showTokens, setShowTokens] = useState(false);

  const selectedToken =
    tokens[selectedTokenIndex];

  const recipientValid =
    /^0x[a-fA-F0-9]{40}$/.test(
      recipient.trim(),
    );

  const amountNumber = Number(amount);

  const amountValid =
    amount.length > 0 &&
    Number.isFinite(amountNumber) &&
    amountNumber > 0;

  const canContinue =
    recipientValid &&
    amountValid &&
    !!selectedToken;

  const handleContinue = () => {
    if (!canContinue || !selectedToken) {
      return;
    }

    onContinue({
      recipient: recipient.trim(),
      tokenSymbol: selectedToken.symbol,
      amount,
      network: getNetworkName(
        selectedToken.chainId,
      ),
    });
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
          Send
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>
          Recipient
        </Text>

        <View
          style={[
            styles.inputContainer,
            recipient.length > 0 &&
              (recipientValid
                ? styles.validInput
                : styles.invalidInput),
          ]}
        >
          <TextInput
            value={recipient}
            onChangeText={setRecipient}
            style={styles.input}
            placeholder="Wallet address"
            placeholderTextColor={
              colors.textMuted
            }
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={styles.scanButton}
            accessibilityRole="button"
            accessibilityLabel="Scan wallet address"
          >
            <ScanLine
              size={22}
              color={colors.text}
              strokeWidth={1.8}
            />
          </Pressable>
        </View>

        {recipient.length > 0 &&
          !recipientValid && (
            <Text style={styles.errorText}>
              Invalid wallet address
            </Text>
          )}

        <Text
          style={[
            styles.label,
            styles.sectionLabel,
          ]}
        >
          Token
        </Text>

        <Pressable
          style={styles.tokenSelector}
          onPress={() =>
            setShowTokens((value) => !value)
          }
        >
          <View style={styles.tokenContent}>
            <View style={styles.tokenIcon}>
              {selectedToken?.logoUri ? (
                <Image
                  source={{
                    uri: selectedToken.logoUri,
                  }}
                  style={styles.tokenLogo}
                />
              ) : (
                <Text style={styles.tokenIconText}>
                  {selectedToken?.symbol?.slice(
                    0,
                    1,
                  ) ?? '?'}
                </Text>
              )}
            </View>

            <View style={styles.tokenInfo}>
              <View style={styles.tokenNameRow}>
                <Text style={styles.tokenSymbol}>
                  {selectedToken?.symbol ??
                    'Select token'}
                </Text>

                {selectedToken && (
                  <Text style={styles.tokenNetwork}>
                    {getNetworkName(
                      selectedToken.chainId,
                    )}
                  </Text>
                )}
              </View>

              {selectedToken && (
                <Text style={styles.tokenBalance}>
                  Balance:{' '}
                  {selectedToken.balanceFormatted}
                </Text>
              )}
            </View>
          </View>

          <ChevronDown
            size={20}
            color={colors.textMuted}
          />
        </Pressable>

        {showTokens && (
          <View style={styles.dropdown}>
            {tokens.length === 0 ? (
              <Text style={styles.emptyText}>
                No tokens available
              </Text>
            ) : (
              tokens.map((token, index) => (
                <Pressable
                  key={`${token.chainId}-${token.address}`}
                  style={styles.tokenOption}
                  onPress={() => {
                    setSelectedTokenIndex(index);
                    setShowTokens(false);
                    setAmount('');
                  }}
                >
                  <View style={styles.tokenContent}>
                    <View style={styles.tokenIcon}>
                      {token.logoUri ? (
                        <Image
                          source={{
                            uri: token.logoUri,
                          }}
                          style={styles.tokenLogo}
                        />
                      ) : (
                        <Text
                          style={
                            styles.tokenIconText
                          }
                        >
                          {token.symbol.slice(
                            0,
                            1,
                          )}
                        </Text>
                      )}
                    </View>

                    <View style={styles.tokenInfo}>
                      <View
                        style={
                          styles.tokenNameRow
                        }
                      >
                        <Text
                          style={
                            styles.tokenSymbol
                          }
                        >
                          {token.symbol}
                        </Text>

                        <Text
                          style={
                            styles.tokenNetwork
                          }
                        >
                          {getNetworkName(
                            token.chainId,
                          )}
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.tokenBalance
                        }
                      >
                        Balance:{' '}
                        {token.balanceFormatted}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}

        <Text
          style={[
            styles.label,
            styles.sectionLabel,
          ]}
        >
          Amount
        </Text>

        <View style={styles.amountContainer}>
          <TextInput
            value={amount}
            onChangeText={(value) => {
              if (
                /^\d*\.?\d*$/.test(value)
              ) {
                setAmount(value);
              }
            }}
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={
              colors.textMuted
            }
            keyboardType="decimal-pad"
          />

          <Text style={styles.amountSymbol}>
            {selectedToken?.symbol ?? ''}
          </Text>
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !canContinue &&
              styles.continueDisabled,
          ]}
        >
          <Text
            style={[
              styles.continueText,
              !canContinue &&
                styles.continueTextDisabled,
            ]}
          >
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function getNetworkName(
  chainId: number,
): string {
  switch (chainId) {
    case 1:
      return 'Ethereum';

    case 8453:
      return 'Base';

    case 42161:
      return 'Arbitrum';

    case 10:
      return 'Optimism';

    case 137:
      return 'Polygon';

    case 56:
      return 'BNB Chain';

    case 43114:
      return 'Avalanche';

    case 11155111:
      return 'Sepolia';

    default:
      return `Chain ${chainId}`;
  }
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  sectionLabel: {
    marginTop: spacing.lg,
  },

  inputContainer: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 16,
  },

  scanButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  validInput: {
    borderColor: colors.primary,
  },

  invalidInput: {
    borderColor: '#EF4444',
  },

  errorText: {
    marginTop: spacing.xs,
    color: '#EF4444',
    fontSize: 12,
  },

  tokenSelector: {
    minHeight: 64,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  tokenContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },

  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  tokenLogo: {
    width: 40,
    height: 40,
  },

  tokenIconText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  tokenInfo: {
    flex: 1,
  },

  tokenNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  tokenSymbol: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  tokenNetwork: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },

  tokenBalance: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  dropdown: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    overflow: 'hidden',
  },

  tokenOption: {
    minHeight: 64,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  emptyText: {
    padding: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
  },

  amountContainer: {
    minHeight: 64,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  amountInput: {
    flex: 1,
    height: 64,
    color: colors.text,
    fontSize: 28,
    fontWeight: '600',
  },

  amountSymbol: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },

  continueButton: {
    height: 52,
    marginTop: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },

  continueDisabled: {
    backgroundColor: colors.border,
  },

  continueText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },

  continueTextDisabled: {
    color: colors.textMuted,
  },
});