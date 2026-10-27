import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  calculateDailyPnl,
  getDailyPortfolioSnapshot,
} from '../services/portfolioSnapshot';

import {
  BalanceCard,
  WalletHeader,
  WalletActions,
  TokenList,
} from '../components/wallet';

import { colors, spacing } from '../theme';

import {
  createWallet,
  getStoredWalletAddress,
} from '../services/wallet';

import { getTokenBalances } from '../services/tokens';
import { getSepoliaBalance } from '../services/sepolia';
import { filterVisibleTokens } from '../services/tokenVisibility';

import type { TokenBalance } from '../types/token';

type WalletScreenProps = {
  tokens: TokenBalance[];
  onTokensChange: (tokens: TokenBalance[]) => void;
  onImportWallet: () => void;
  onManageTokens: () => void;
  onSend: () => void;
};

export function WalletScreen({
  tokens,
  onTokensChange,
  onImportWallet,
  onManageTokens,
  onSend,
}: WalletScreenProps) {
  const [actionsOpen, setActionsOpen] =
    useState(true);

  const [loadingTokens, setLoadingTokens] =
    useState(false);

  const [visibleTokens, setVisibleTokens] =
    useState<TokenBalance[]>([]);

  const balanceTranslateY = useRef(
    new Animated.Value(18),
  ).current;

  const actionsTranslateY = useRef(
    new Animated.Value(18),
  ).current;

  const tokensTranslateY = useRef(
    new Animated.Value(18),
  ).current;

  useEffect(() => {
    Animated.stagger(45, [
      Animated.timing(balanceTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(actionsTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(tokensTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    balanceTranslateY,
    actionsTranslateY,
    tokensTranslateY,
  ]);

  useEffect(() => {
    const initWallet = async () => {
      try {
        let address =
          await getStoredWalletAddress();

        if (!address) {
          const wallet = await createWallet();

          address = wallet.address;

          console.log(
            'WALLA NEW WALLET ADDRESS:',
            address,
          );
        } else {
          console.log(
            'WALLA WALLET ADDRESS:',
            address,
          );
        }

        setLoadingTokens(true);

        const [
          mainnetTokens,
          sepoliaToken,
        ] = await Promise.all([
          getTokenBalances(address),
          getSepoliaBalance(address),
        ]);

        const allTokens: TokenBalance[] = [
          ...mainnetTokens,
          sepoliaToken,
        ];

        onTokensChange(allTokens);
      } catch (error) {
        console.error(
          'Failed to initialize wallet:',
          error,
        );
      } finally {
        setLoadingTokens(false);
      }
    };

    initWallet();
  }, [onTokensChange]);

  useEffect(() => {
    const updateVisibleTokens = async () => {
      const visible =
        await filterVisibleTokens(tokens);

      setVisibleTokens(visible);
    };

    updateVisibleTokens();
  }, [tokens]);

  const totalBalanceUsd = tokens.reduce(
    (total, token) =>
      total + token.valueUsd,
    0,
  );

  const [dailyPnl, setDailyPnl] =
    useState('+0.0%');

  useEffect(() => {
    const updateDailyPnl = async () => {
      const snapshot =
        await getDailyPortfolioSnapshot(
          totalBalanceUsd,
        );

      const pnl = calculateDailyPnl(
        totalBalanceUsd,
        snapshot.valueUsd,
      );

      const sign =
        pnl.percentage >= 0 ? '+' : '';

      setDailyPnl(
        `${sign}${pnl.percentage.toFixed(1)}%`,
      );
    };

    updateDailyPnl();
  }, [totalBalanceUsd]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WalletHeader
          onWalletPress={onImportWallet}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Animated.View
          style={[
            styles.balanceSection,
            {
              transform: [
                {
                  translateY:
                    balanceTranslateY,
                },
              ],
            },
          ]}
        >
          <BalanceCard
            balance={`$${totalBalanceUsd.toLocaleString(
              'en-US',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`}
            dailyPnl={dailyPnl}
            actionsOpen={actionsOpen}
            onToggleActions={() =>
              setActionsOpen(
                (open) => !open,
              )
            }
          />

          {actionsOpen && (
            <Animated.View
              style={{
                transform: [
                  {
                    translateY:
                      actionsTranslateY,
                  },
                ],
              }}
            >
              <WalletActions
                onSend={onSend}
              />
            </Animated.View>
          )}
        </Animated.View>

        <Animated.View
          style={{
            transform: [
              {
                translateY:
                  tokensTranslateY,
              },
            ],
          }}
        >
          <TokenList
            tokens={visibleTokens}
            loading={loadingTokens}
            onSeeAll={onManageTokens}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingTop: 32,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingTop: 104,
    paddingBottom: 110,
  },

  balanceSection: {
    marginTop: -9,
  },
});