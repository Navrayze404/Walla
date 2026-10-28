
import {
  Bell,
  History,
  WalletMinimal,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  getActiveWallet,
  type StoredWallet,
} from '../../services/wallet';

import { colors, spacing } from '../../theme';

type WalletHeaderProps = {
  onWalletPress: () => void;
  onHistoryPress: () => void;
};

export function WalletHeader({
  onWalletPress,
  onHistoryPress,
}: WalletHeaderProps) {
  const [activeWallet, setActiveWalletState] =
    useState<StoredWallet | null>(null);

  useEffect(() => {
    const loadActiveWallet = async () => {
      try {
        const wallet = await getActiveWallet();
        setActiveWalletState(wallet);
      } catch (error) {
        console.error(
          'Failed to load active wallet:',
          error,
        );
      }
    };

    void loadActiveWallet();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 0.85)',
          'rgba(0, 0, 0, 0)',
        ]}
        locations={[0, 0.55, 1]}
        style={styles.gradient}
      />

      <Pressable
        onPress={onWalletPress}
        style={styles.walletSelector}
        accessibilityRole="button"
        accessibilityLabel="Manage wallet"
      >
        <WalletMinimal
          size={16}
          color={colors.primary}
          strokeWidth={2}
        />

        <Text
          style={styles.walletName}
          numberOfLines={1}
        >
          {activeWallet?.name ?? 'Wallet'}
        </Text>
      </Pressable>

      <Text style={styles.title}>Home</Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Transaction history"
          onPress={onHistoryPress}
        >
          <History
            size={24}
            color={colors.text}
            strokeWidth={1.8}
          />
        </Pressable>

        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Bell
            size={24}
            color={colors.text}
            strokeWidth={1.8}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  gradient: {
    position: 'absolute',
    top: -32,
    left: -spacing.md,
    right: -spacing.md,
    height: 120,
  },

  walletSelector: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#123C35',
    borderRadius: 26,
  },

  walletName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  actions: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    gap: spacing.xs,
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
