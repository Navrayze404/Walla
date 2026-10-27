import {
    Phone,
    PhoneCall,
    Search,
    Video,
} from 'lucide-react-native';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { ScreenHeader } from '../components/common';

import {
    colors,
    radius,
    spacing,
    typography,
} from '../theme';

type CallScreenProps = {
    onBackToWallet?: () => void;
    onStartCall?: () => void;
};

type CallItem = {
    id: string;
    address: string;
    type: 'incoming' | 'outgoing' | 'missed';
    callType: 'audio' | 'video';
    timestamp: string;
};

const calls: CallItem[] = [];

export function CallScreen({
    onBackToWallet,
    onStartCall,
}: CallScreenProps) {
    const renderCall = ({
        item,
    }: {
        item: CallItem;
    }) => {
        const missed = item.type === 'missed';

        return (
            <Pressable style={styles.callRow}>
                <View style={styles.avatar}>
                    {item.callType === 'video' ? (
                        <Video
                            size={22}
                            color={colors.text}
                            strokeWidth={1.8}
                        />
                    ) : (
                        <Phone
                            size={22}
                            color={colors.text}
                            strokeWidth={1.8}
                        />
                    )}
                </View>

                <View style={styles.callInfo}>
                    <Text
                        style={[
                            styles.address,
                            missed && styles.missed,
                        ]}
                        numberOfLines={1}
                    >
                        {item.address}
                    </Text>

                    <View style={styles.callMeta}>
                        {item.type === 'incoming' ? (
                            <Phone
                                size={13}
                                color={colors.textMuted}
                                strokeWidth={1.8}
                            />
                        ) : (
                            <PhoneCall
                                size={13}
                                color={colors.textMuted}
                                strokeWidth={1.8}
                            />
                        )}

                        <Text style={styles.timestamp}>
                            {item.timestamp}
                        </Text>
                    </View>
                </View>

                <Pressable style={styles.callButton}>
                    {item.callType === 'video' ? (
                        <Video
                            size={20}
                            color={colors.primary}
                            strokeWidth={1.8}
                        />
                    ) : (
                        <Phone
                            size={20}
                            color={colors.primary}
                            strokeWidth={1.8}
                        />
                    )}
                </Pressable>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Calls"
                right={
                    <Pressable
                        style={styles.newCallButton}
                        onPress={onStartCall}
                        accessibilityRole="button"
                        accessibilityLabel="New call"
                    >
                        <Phone
                            size={20}
                            color={colors.text}
                            strokeWidth={1.8}
                        />
                    </Pressable>
                }
            />

            <View style={styles.searchContainer}>
                <Search
                    size={18}
                    color={colors.textMuted}
                    strokeWidth={1.8}
                />

                <TextInput
                    placeholder="Search calls"
                    placeholderTextColor={colors.textMuted}
                    style={styles.searchInput}
                />
            </View>

            <FlatList
                data={calls}
                keyExtractor={(item) => item.id}
                renderItem={renderCall}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <View style={styles.emptyIcon}>
                            <Phone
                                size={28}
                                color={colors.textMuted}
                                strokeWidth={1.6}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            No calls yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Your encrypted voice and video
                            calls will appear here.
                        </Text>

                        <Pressable
                            style={styles.startButton}
                            onPress={onStartCall}
                        >
                            <Phone
                                size={17}
                                color={colors.background}
                                strokeWidth={2}
                            />

                            <Text style={styles.startButtonText}>
                                Start Call
                            </Text>
                        </Pressable>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    newCallButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.button,
        backgroundColor: colors.surface,
    },

    searchContainer: {
        marginTop: 8,
        marginHorizontal: spacing.md,
        height: 48,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 24,
        backgroundColor: colors.surface,
    },

    searchInput: {
        flex: 1,
        color: colors.text,
        ...typography.body,
    },

    list: {
        flexGrow: 1,
        paddingHorizontal: spacing.md,
        paddingBottom: 120,
    },

    callRow: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    avatar: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    callInfo: {
        flex: 1,
    },

    address: {
        ...typography.body,
        color: colors.text,
        fontWeight: '600',
    },

    missed: {
        color: '#EF4444',
    },

    callMeta: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },

    timestamp: {
        ...typography.caption,
        color: colors.textMuted,
    },

    callButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },

    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },

    emptyIcon: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 32,
        backgroundColor: colors.surface,
    },

    emptyTitle: {
        ...typography.heading,
        color: colors.text,
    },

    emptyText: {
        marginTop: spacing.xs,
        textAlign: 'center',
        color: colors.textMuted,
        ...typography.caption,
    },

    startButton: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        borderRadius: radius.button,
        backgroundColor: colors.primary,
    },

    startButtonText: {
        ...typography.label,
        color: colors.background,
    },
});