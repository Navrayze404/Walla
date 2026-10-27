import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  MessageCircle,
  Search,
} from 'lucide-react-native';

import {
  colors,
  spacing,
  typography,
} from '../theme';
import { ScreenHeader } from '../components/common';

type Chat = {
  id: string;
  address: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
};

type ChatScreenProps = {
  onBackToWallet: () => void;
  onOpenChat?: (chatId: string) => void;
};

const chats: Chat[] = [];

export function ChatScreen({
  onBackToWallet,
  onOpenChat,
}: ChatScreenProps) {
  const [search, setSearch] = useState('');

  const filteredChats = chats.filter((chat) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      chat.address.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    );
  });

  const renderChat = ({
    item,
  }: {
    item: Chat;
  }) => (
    <Pressable
      style={styles.chatRow}
      onPress={() => onOpenChat?.(item.id)}
    >
      <View style={styles.avatar}>
        <MessageCircle
          size={24}
          color={colors.text}
          strokeWidth={1.8}
        />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <Text
            style={styles.address}
            numberOfLines={1}
          >
            {item.address}
          </Text>

          <Text style={styles.timestamp}>
            {item.timestamp}
          </Text>
        </View>

        <View style={styles.chatBottom}>
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {item.unread > 0 && (
            <View style={styles.unread}>
              <Text style={styles.unreadText}>
                {item.unread > 99 ? '99+' : item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Chat" />

      <View style={styles.searchContainer}>
        <Search
          size={18}
          color={colors.textMuted}
          strokeWidth={1.8}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search chats"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <MessageCircle
                size={28}
                color={colors.textMuted}
                strokeWidth={1.6}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No chats yet
            </Text>

            <Text style={styles.emptyText}>
              Start a private conversation with another
              Walla user.
            </Text>

            <Pressable style={styles.startButton}>
              <Text style={styles.startButtonText}>
                Start Chat
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


  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
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
    ...typography.body,
    color: colors.text,
  },

  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 110,
    flexGrow: 1,
  },

  chatRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 26,
  },

  chatContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  chatTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  address: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },

  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },

  chatBottom: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  lastMessage: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
  },

  unread: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: colors.primary,
  },

  unreadText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '600',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
  },

  emptyTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.md,
  },

  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  startButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  startButtonText: {
    ...typography.label,
    color: colors.background,
    fontWeight: '600',
  },
});