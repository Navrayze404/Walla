import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CryptoIcon } from '@vnaidin/react-native-cryptocurrency-icons';
import { colors, spacing, typography } from '../../theme';
import type { TokenBalance } from '../../types/token';

type TokenListProps = {
  tokens: TokenBalance[];
  loading: boolean;
  onSeeAll: () => void;
};

type ChainInfo = {
  name: string;
  logo: string;
};

const chainInfo: Record<number, ChainInfo> = {
  1: {
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  8453: {
    name: 'Base',
    logo: 'https://cryptologos.cc/logos/base-base-logo.png',
  },
  42161: {
    name: 'Arbitrum',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  },
  10: {
    name: 'Optimism',
    logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  },
  137: {
    name: 'Polygon',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  56: {
    name: 'BNB Chain',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  },
  43114: {
    name: 'Avalanche',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  },
  11155111: {
    name: 'Sepolia',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
};

export function TokenList({
  tokens,
  loading,
  onSeeAll,
}: TokenListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Tokens</Text>

        <Pressable
          onPress={onSeeAll}
          accessibilityRole="button"
          accessibilityLabel="See all tokens"
        >
          <Text style={styles.seeAll}>See all ›</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.amount}>Loading tokens...</Text>
      ) : tokens.length === 0 ? (
        <Text style={styles.amount}>No tokens found</Text>
      ) : (
        tokens.map((token) => {
          const chain = chainInfo[token.chainId];

          return (
            <View
              key={`${token.chainId}-${token.address}`}
              style={styles.card}
            >
              <View style={styles.tokenInfo}>
                <View style={styles.tokenLogoWrapper}>
                  {token.logoUri ? (
                    <Image
                      source={{ uri: token.logoUri }}
                      style={styles.logo}
                    />
                  ) : (
                    <CryptoIcon
                      symbol={token.symbol}
                      size={40}
                    />
                  )}

                  {chain && (
                    <Image
                      source={{ uri: chain.logo }}
                      style={styles.chainLogo}
                    />
                  )}
                </View>

                <View style={styles.tokenText}>
                  <Text style={styles.symbol}>
                    {token.symbol}
                  </Text>

                  <Text style={styles.name}>
                    {token.name}
                  </Text>
                </View>
              </View>

              <View style={styles.balance}>
                <Text style={styles.amount}>
                  {token.balanceFormatted} {token.symbol}
                </Text>

                {token.priceUsd > 0 && (
                  <Text style={styles.value}>
                    $
                    {token.valueUsd.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  heading: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  title: {
    ...typography.heading,
    color: colors.text,
  },

  seeAll: {
    ...typography.label,
    color: colors.secondary,
  },

  card: {
    minHeight: 76,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },

  tokenLogoWrapper: {
    position: 'relative',
    width: 40,
    height: 40,
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  chainLogo: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,

    borderColor: colors.background,
  },

  tokenText: {
    flexShrink: 1,
  },

  symbol: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  name: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs / 2,
  },

  balance: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },

  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  amount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs / 2,
  },
});