import {
    ArrowLeft,
    Gem,
    Heart,
    Hexagon,
    MoreHorizontal,
    Shield,
    Star,
    User,
    WalletCards,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    getStoredWallets,
    getActiveWallet,
    setActiveWallet,
    type StoredWallet,
} from '../services/wallet';

import {
    colors,
    radius,
    spacing,
    typography,
} from '../theme';

type ManageWalletScreenProps = {
    onClose: () => void;
    onAddWallet: () => void;
    onCreateWallet: () => void;
    onManageAccount: (
        walletId: string,
        walletName: string,
    ) => void;
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

export function ManageWalletScreen({
    onClose,
    onAddWallet,
    onCreateWallet,
    onManageAccount,
}: ManageWalletScreenProps) {
    const [wallets, setWallets] =
        useState<StoredWallet[]>([]);

    const [activeWalletId, setActiveWalletId] =
        useState<string | null>(null);

    const loadWallets = async () => {
        try {
            const [
                storedWallets,
                activeWallet,
            ] = await Promise.all([
                getStoredWallets(),
                getActiveWallet(),
            ]);

            setWallets(storedWallets);
            setActiveWalletId(
                activeWallet?.id ?? null,
            );
        } catch (error) {
            console.error(
                'Failed to load wallets:',
                error,
            );
        }
    };

    useEffect(() => {
        loadWallets();
    }, []);

    const handleSelectWallet = async (
        wallet: StoredWallet,
    ) => {
        try {
            await setActiveWallet(wallet.id);
            setActiveWalletId(wallet.id);
        } catch (error) {
            console.error(
                'Failed to switch wallet:',
                error,
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={onClose}
                        style={styles.headerButton}
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
                        Wallets
                    </Text>

                    <View style={styles.headerButtonPlaceholder} />
                </View>

                {/* Intro */}
                <View style={styles.intro}>
                    <Text style={styles.sectionTitle}>
                        Your wallets
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Select a wallet to make it active.
                    </Text>
                </View>

                {/* Wallet List */}
                <View style={styles.walletList}>
                    {wallets.map((wallet) => {
                        const active =
                            wallet.id === activeWalletId;

                        const Icon =
                            wallet.icon === 'photo'
                                ? WalletCards
                                : iconComponents[
                                wallet.icon ?? 'wallet'
                                ];

                        return (
                            <View
                                key={wallet.id}
                                style={[
                                    styles.walletCard,
                                    active && styles.walletCardActive,
                                ]}
                            >
                                <Pressable
                                    onPress={() =>
                                        handleSelectWallet(wallet)
                                    }
                                    style={({ pressed }) => [
                                        styles.walletMain,
                                        pressed && styles.pressed,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Select ${wallet.name}`}
                                >
                                    <View
                                        style={[
                                            styles.walletIcon,
                                            active &&
                                            styles.walletIconActive,
                                        ]}
                                    >
                                        <Icon
                                            size={26}
                                            color={
                                                active
                                                    ? colors.primary
                                                    : colors.text
                                            }
                                            strokeWidth={1.8}
                                        />
                                    </View>

                                    <View style={styles.walletText}>
                                        <View style={styles.nameRow}>
                                            <Text
                                                style={styles.walletName}
                                                numberOfLines={1}
                                            >
                                                {wallet.name}
                                            </Text>

                                            {active && (
                                                <View
                                                    style={styles.activeBadge}
                                                >
                                                    

                                                    <Text
                                                        style={
                                                            styles.activeText
                                                        }
                                                    >
                                                        Active
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.address}>
                                            {wallet.address.slice(0, 6)}
                                            ...
                                            {wallet.address.slice(-4)}
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={styles.moreButton}
                                    onPress={() =>
                                        onManageAccount(
                                            wallet.id,
                                            wallet.name,
                                        )
                                    }
                                    accessibilityRole="button"
                                    accessibilityLabel={`${wallet.name} options`}
                                    hitSlop={8}
                                >
                                    <MoreHorizontal
                                        size={22}
                                        color={colors.textMuted}
                                        strokeWidth={2}
                                    />
                                </Pressable>
                            </View>
                        );
                    })}
                </View>

                {/* Wallet Count */}
                <Text style={styles.walletCount}>
                    {wallets.length}{' '}
                    {wallets.length === 1
                        ? 'wallet'
                        : 'wallets'}
                </Text>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottom}>
                <Pressable
                    onPress={onCreateWallet}
                    style={({ pressed }) => [
                        styles.createButton,
                        pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Create wallet"
                >
                    <WalletCards
                        size={22}
                        color={colors.background}
                        strokeWidth={2}
                    />

                    <Text style={styles.createButtonText}>
                        Create new wallet
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onAddWallet}
                    style={({ pressed }) => [
                        styles.importButton,
                        pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Import wallet"
                >
                    <Text style={styles.importButtonText}>
                        Import existing wallet
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

    content: {
        paddingHorizontal: spacing.md,
        paddingTop: 32,
    },

    header: {
        height: 56,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },

    headerButton: {
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

    headerButtonPlaceholder: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },

    intro: {
        marginBottom: spacing.md,
    },

    sectionTitle: {
        ...typography.heading,
        color: colors.text,
    },

    sectionSubtitle: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    walletList: {
        gap: spacing.sm,
    },

    walletCard: {
        minHeight: 80,
        padding: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
    },

    walletCardActive: {
        borderColor: colors.primary,
    },

    walletMain: {
        flex: 1,
        minHeight: 64,
        paddingLeft: spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
    },

    walletIcon: {
        width: 48,
        height: 48,
        marginRight: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.border,
        borderRadius: 16,
    },

    walletIconActive: {
        backgroundColor: '#123C35',
    },

    walletText: {
        flex: 1,
        minWidth: 0,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },

    walletName: {
        flexShrink: 1,
        ...typography.body,
        color: colors.text,
        fontWeight: '600',
    },

    activeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#123C35',
        borderRadius: 8,
    },

    activeText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },

    address: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: 4,
    },

    moreButton: {
        width: 44,
        height: 44,
        marginLeft: spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
    },

    walletCount: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
    },

    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
        gap: spacing.sm,
    },

    createButton: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: radius.button,
    },

    createButtonText: {
        ...typography.body,
        color: colors.background,
        fontWeight: '700',
    },

    importButton: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.button,
    },

    importButtonText: {
        ...typography.body,
        color: colors.text,
        fontWeight: '600',
    },

    pressed: {
        opacity: 0.7,
    },
});