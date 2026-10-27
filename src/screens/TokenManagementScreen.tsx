import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  colors,
  radius,
  spacing,
  typography,
} from '../theme';

import type { TokenBalance } from '../types/token';

import {
  isTokenVisible,
  setTokenVisibility,
} from '../services/tokenVisibility';

type TokenManagementScreenProps = {
  tokens: TokenBalance[];
  onBack: () => void;
  onVisibilityChange: (tokens: TokenBalance[]) => void;
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

export function TokenManagementScreen({
  tokens,
  onBack,
  onVisibilityChange,
}: TokenManagementScreenProps) {
  const toggleToken = async (
    token: TokenBalance,
    visible: boolean,
  ) => {
    try {
      await setTokenVisibility(token, visible);
      onVisibilityChange(tokens);
    } catch (error) {
      console.error(
        'Failed to update token visibility:',
        error,
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 0.95)',
          'rgba(0, 0, 0, 0.65)',
          'rgba(0, 0, 0, 0)',
        ]}
        locations={[0, 0.25, 0.6, 1]}
        style={styles.gradient}
        pointerEvents="none"
      />

      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          Manage Tokens
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {tokens.map((token) => {
          const chain = chainInfo[token.chainId];

          return (
            <TokenRow
              key={`${token.chainId}-${token.address}`}
              token={token}
              chain={chain}
              onToggle={toggleToken}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

type TokenRowProps = {
  token: TokenBalance;
  chain?: ChainInfo;
  onToggle: (
    token: TokenBalance,
    visible: boolean,
  ) => void;
};

function TokenRow({
  token,
  chain,
  onToggle,
}: TokenRowProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mounted = true;

    isTokenVisible(token).then((result) => {
      if (mounted) {
        setVisible(result);
      }
    });

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleToggle = () => {
    const nextVisible = !visible;

    setVisible(nextVisible);
    onToggle(token, nextVisible);
  };

  return (
    <View style={styles.row}>
      <View style={styles.tokenInfo}>
        <View style={styles.tokenLogoWrapper}>
          {token.logoUri ? (
            <Image
              source={{ uri: token.logoUri }}
              style={styles.logo}
            />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.logoFallbackText}>
                {token.symbol.slice(0, 1)}
              </Text>
            </View>
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
            {chain?.name ?? 'Unknown network'}
          </Text>
        </View>
      </View>

      <Switch
        value={visible}
        onValueChange={handleToggle}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
        thumbColor={colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },

  gradient: {
    position: 'absolute',
    top: -32,
    left: -spacing.md,
    right: -spacing.md,
    height: 220,
    zIndex: 5,
  },

  header: {
    position: 'relative',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    backgroundColor: 'transparent',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    fontWeight: '300',
  },

  title: {
    ...typography.title,
    color: colors.text,
  },

  headerSpacer: {
    width: 40,
  },

  list: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  row: {
    minHeight: 72,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
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

  logoFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },

  logoFallbackText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  chainLogo: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
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
    marginTop: 2,
  },
});