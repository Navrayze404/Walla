import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

const items = [
    { label: 'Home', icon: 'home' },
    { label: 'Chat', icon: 'message-outline' },
    { label: 'Activity', icon: 'clock-outline' },
    { label: 'Calls', icon: 'phone-outline' },
] as const;

export function WalletBottomNav() {
    return (
        <View style={styles.container}>
            {items.map((item, index) => {
                const active = index === 0;

                return (
                    <Pressable
                        key={item.label}
                        style={styles.item}
                        accessibilityRole="button"
                        accessibilityLabel={item.label}
                        accessibilityState={{ selected: active }}
                        onPress={() => { }}
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={32}
                            color={active ? colors.primary : colors.textMuted}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.md,

        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',

        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.card,

        paddingHorizontal: spacing.sm,
    },

    item: {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    label: {
        ...typography.caption,
        color: colors.textMuted,
    },

    activeLabel: {
        color: colors.primary,
        fontWeight: '600',
    },
});