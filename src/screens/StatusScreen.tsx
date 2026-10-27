import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getMyStatuses,
  getActiveStatuses,
  type Status,
} from '../services/status';

import { ScreenHeader } from '../components/common';

import {
  colors,
  radius,
  spacing,
  typography,
} from '../theme';

type StatusScreenProps = {
  onCreateStatus: () => void;
  onOpenStatus: (status: Status) => void;
  onBack?: () => void;
};

export function StatusScreen({
  onCreateStatus,
  onOpenStatus,
  onBack,
}: StatusScreenProps) {
  const [myStatuses, setMyStatuses] = useState<Status[]>([]);
  const [otherStatuses, setOtherStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStatuses = useCallback(async () => {
    try {
      setLoading(true);

      const [mine, all] = await Promise.all([
        getMyStatuses(),
        getActiveStatuses(),
      ]);

      const myIds = new Set(
        mine.map((status) => status.id),
      );

      setMyStatuses(mine);

      setOtherStatuses(
        all.filter(
          (status) => !myIds.has(status.id),
        ),
      );
    } catch (error) {
      console.error(
        'Failed to load statuses:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const renderMyStatus = () => {
    const latestStatus = myStatuses[0];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          My Status
        </Text>

        <Pressable
          style={styles.myStatus}
          onPress={
            latestStatus
              ? () => onOpenStatus(latestStatus)
              : onCreateStatus
          }
        >
          <View style={styles.avatarWrapper}>
            {latestStatus ? (
              <Image
                source={{
                  uri: latestStatus.mediaUri,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.emptyAvatar}>
                <Text style={styles.plus}>
                  +
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.name}>
              My Status
            </Text>

            <Text style={styles.subtitle}>
              {latestStatus
                ? `${myStatuses.length} status${
                    myStatuses.length > 1
                      ? 'es'
                      : ''
                  }`
                : 'Add a status'}
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={onCreateStatus}
          >
            <Text style={styles.addButtonText}>
              +
            </Text>
          </Pressable>
        </Pressable>
      </View>
    );
  };

  const renderStatus = ({
    item,
  }: {
    item: Status;
  }) => {
    return (
      <Pressable
        style={styles.statusRow}
        onPress={() => onOpenStatus(item)}
      >
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: item.mediaUri,
            }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.statusInfo}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {item.walletAddress.slice(0, 6)}...
            {item.walletAddress.slice(-4)}
          </Text>

          <Text style={styles.subtitle}>
            {formatStatusTime(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Activity" />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
        </View>
      ) : (
        <FlatList
          data={otherStatuses}
          keyExtractor={(item) => item.id}
          renderItem={renderStatus}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadStatuses}
          contentContainerStyle={styles.content}
          ListHeaderComponent={renderMyStatus}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No new status
              </Text>

              <Text style={styles.emptyText}>
                Status dari kontak akan muncul di sini.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function formatStatusTime(
  timestamp: number,
): string {
  const diff =
    Date.now() - timestamp;

  const minutes = Math.floor(
    diff / 60_000,
  );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return 'Yesterday';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    paddingTop: 8,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  myStatus: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  avatarWrapper: {
    width: 58,
    height: 58,
    padding: 2,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 29,
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },

  emptyAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.surface,
  },

  plus: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '400',
  },

  statusInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  name: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  addButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
  },

  addButtonText: {
    fontSize: 22,
    color: colors.primary,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },

  emptyTitle: {
    ...typography.body,
    color: colors.text,
  },

  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});