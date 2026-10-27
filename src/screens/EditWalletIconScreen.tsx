import {
  Camera,
  CircleUserRound,
  Gem,
  Heart,
  Hexagon,
  Shield,
  Star,
  WalletCards,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type IconType =
  | 'wallet'
  | 'user'
  | 'shield'
  | 'gem'
  | 'star'
  | 'heart'
  | 'hexagon';

type EditWalletIconScreenProps = {
  onBack: () => void;
  onSave: (icon: IconType | 'photo') => void;
  onUploadPhoto: () => void;
};

const icons = [
  { type: 'wallet' as const, Icon: WalletCards },
  { type: 'user' as const, Icon: CircleUserRound },
  { type: 'shield' as const, Icon: Shield },
  { type: 'gem' as const, Icon: Gem },
  { type: 'star' as const, Icon: Star },
  { type: 'heart' as const, Icon: Heart },
  { type: 'hexagon' as const, Icon: Hexagon },
];

export function EditWalletIconScreen({
  onBack,
  onSave,
  onUploadPhoto,
}: EditWalletIconScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Edit wallet icon</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.preview}>
        <View style={styles.previewIcon}>
          <WalletCards
            size={40}
            color={colors.text}
            strokeWidth={1.8}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Choose an icon</Text>

      <View style={styles.iconGrid}>
        {icons.map(({ type, Icon }) => (
          <Pressable
            key={type}
            onPress={() => onSave(type)}
            style={({ pressed }) => [
              styles.iconOption,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${type} icon`}
          >
            <Icon
              size={32}
              color={colors.text}
              strokeWidth={1.8}
            />
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Or use your own</Text>

      <Pressable
        onPress={onUploadPhoto}
        style={({ pressed }) => [
          styles.uploadButton,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Upload wallet photo"
      >
        <Camera
          size={24}
          color={colors.text}
          strokeWidth={1.8}
        />

        <Text style={styles.uploadText}>
          Upload photo
        </Text>
      </Pressable>

      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.cancelButton,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 32,
  },

  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  headerButton: {
    position: 'absolute',
    left: 0,
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

  preview: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },

  previewIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 48,
  },

  sectionTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },

  iconOption: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  uploadButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  uploadText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  cancelButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },

  cancelText: {
    ...typography.body,
    color: colors.textMuted,
  },

  pressed: {
    opacity: 0.7,
  },
});