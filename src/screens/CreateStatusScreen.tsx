import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

import {
  createRemoteStatus,
} from '../services/statusApi';

import {
  colors,
  radius,
  spacing,
  typography,
} from '../theme';

type StatusMediaType = 'image' | 'video';

type CreateStatusScreenProps = {
  onBack: () => void;
  onCreated: () => void;
};

export function CreateStatusScreen({
  onBack,
  onCreated,
}: CreateStatusScreenProps) {
  const [mediaUri, setMediaUri] = useState('');
  const [mediaType, setMediaType] =
    useState<StatusMediaType>('image');
  const [caption, setCaption] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handlePickMedia = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Walla membutuhkan akses ke galeri untuk membuat status.',
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 0.9,
        videoMaxDuration: 60,
      });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];

    setMediaUri(asset.uri);
    setMediaType(
      asset.type === 'video'
        ? 'video'
        : 'image',
    );
  };

  const handlePublish = async () => {
    if (!mediaUri) {
      Alert.alert(
        'Media required',
        'Pilih foto atau video terlebih dahulu.',
      );
      return;
    }

    try {
      setPublishing(true);

      await createRemoteStatus({
        mediaUri,
        mediaType,
        caption,
      });

      onCreated();
    } catch (error) {
      console.error(
        'Failed to publish status:',
        error,
      );

      Alert.alert(
        'Failed',
        error instanceof Error
          ? error.message
          : 'Status gagal dibuat.',
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          disabled={publishing}
        >
          <Text style={styles.back}>
            Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          New Status
        </Text>

        <Pressable
          onPress={handlePublish}
          disabled={publishing}
        >
          <Text
            style={[
              styles.publish,
              publishing && styles.disabled,
            ]}
          >
            {publishing
              ? 'Posting...'
              : 'Post'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Pressable
          style={styles.mediaPicker}
          onPress={handlePickMedia}
          disabled={publishing}
        >
          {mediaUri &&
          mediaType === 'image' ? (
            <Image
              source={{ uri: mediaUri }}
              style={styles.preview}
            />
          ) : mediaUri &&
            mediaType === 'video' ? (
            <Video
              source={{ uri: mediaUri }}
              style={styles.preview}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
            />
          ) : (
            <View style={styles.emptyMedia}>
              <Text style={styles.emptyTitle}>
                Add Photo or Video
              </Text>

              <Text style={styles.emptyText}>
                Pilih media dari device
              </Text>
            </View>
          )}
        </Pressable>

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Add a caption..."
          placeholderTextColor={
            colors.textMuted
          }
          multiline
          maxLength={500}
          editable={!publishing}
          style={styles.caption}
        />

        <Text style={styles.expiry}>
          Status akan otomatis expired
          setelah 24 jam.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 88,
    paddingHorizontal: spacing.md,
    paddingTop: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  back: {
    ...typography.body,
    color: colors.textMuted,
  },

  title: {
    ...typography.heading,
    color: colors.text,
  },

  publish: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    flex: 1,
    padding: spacing.md,
  },

  mediaPicker: {
    width: '100%',
    aspectRatio: 9 / 14,
    maxHeight: 560,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  preview: {
    width: '100%',
    height: '100%',
  },

  emptyMedia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },

  emptyTitle: {
    ...typography.heading,
    color: colors.text,
  },

  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },

  caption: {
    minHeight: 56,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    color: colors.text,
    backgroundColor: colors.surface,
    ...typography.body,
  },

  expiry: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    ...typography.caption,
  },
});