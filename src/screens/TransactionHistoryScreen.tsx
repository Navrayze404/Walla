
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
} from 'lucide-react-native';

import { getTransactionHistory } from '../services/transactionHistory';
import type { WalletTransaction } from '../types/transaction';
import { colors, spacing } from '../theme';

type Props = {
  onBack?: () => void;
};

type ChartPoint = {
  day: number;
  income: number;
  expense: number;
};

export function TransactionHistoryScreen({ onBack }: Props) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setTransactions(await getTransactionHistory());
    } catch {
      setError('Riwayat transaksi gagal dimuat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const chartDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  const chartData: ChartPoint[] = chartDays.map((date, index) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dailyTransactions = transactions.filter((transaction) => {
      const createdAt = transaction.createdAt;
      return createdAt >= date.getTime() && createdAt < nextDate.getTime();
    });

    return {
      day: index,
      income: dailyTransactions.reduce(
        (sum, transaction) =>
          transaction.type === 'receive'
            ? sum + (Number(transaction.amount) || 0)
            : sum,
        0,
      ),
      expense: dailyTransactions.reduce(
        (sum, transaction) =>
          transaction.type === 'send'
            ? sum + (Number(transaction.amount) || 0)
            : sum,
        0,
      ),
    };
  });

  const chartMax = Math.max(
    1,
    ...chartData.map((point) => Math.max(point.income, point.expense)),
  );

  const makeChartPath = (key: 'income' | 'expense') => {
    const points = chartData.map((point, index) => ({
      x: 6 + (index * 288) / (chartData.length - 1),
      y: 8 + (1 - point[key] / chartMax) * 144,
    }));

    const line = points
      .map((point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;

        const previous = points[index - 1];
        const middleX = (previous.x + point.x) / 2;

        return `C ${middleX} ${previous.y}, ${middleX} ${point.y}, ${point.x} ${point.y}`;
      })
      .join(' ');

    return {
      line,
      area: `${line} L 294 160 L 6 160 Z`,
    };
  };

  const incomePath = makeChartPath('income');
  const expensePath = makeChartPath('expense');

  const dashboard = transactions.reduce(
    (result, transaction) => {
      const amount = Number(transaction.amount) || 0;

      if (transaction.type === 'receive') {
        result.income += amount;
      } else {
        result.expense += amount;
      }

      if (transaction.status === 'pending') result.pending += 1;
      if (transaction.status === 'success') result.sent += 1;

      return result;
    },
    { income: 0, expense: 0, pending: 0, sent: 0 },
  );

  const formatAmount = (amount: number) =>
    amount.toLocaleString('id-ID', {
      maximumFractionDigits: 5,
    });

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const shorten = (value: string) =>
    value.length > 18
      ? `${value.slice(0, 10)}...${value.slice(-6)}`
      : value;

  const statusLabel: Record<WalletTransaction['status'], string> = {
    pending: 'Pending',
    success: 'Terkirim',
    failed: 'Gagal',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <LinearGradient
          colors={[
            'rgba(0,0,0,1)',
            'rgba(0,0,0,0.85)',
            'rgba(0,0,0,0)',
          ]}
          locations={[0, 0.55, 1]}
          style={styles.headerGradient}
          pointerEvents="none"
        />

        <Pressable
          onPress={onBack}
          disabled={!onBack}
          hitSlop={8}
          style={[styles.headerButton, styles.leftButton]}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Transaction History</Text>

        <Pressable
          onPress={() => void loadTransactions()}
          disabled={loading}
          hitSlop={8}
          style={[styles.headerButton, styles.rightButton]}
          accessibilityRole="button"
          accessibilityLabel="Refresh transaksi"
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.textMuted} />
          ) : (
            <RefreshCw size={21} color={colors.text} />
          )}
        </Pressable>
      </View>

      <FlatList
        data={loading || error ? [] : transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.itemSpacing} />}
        ListHeaderComponent={
          <>
            <View style={styles.dashboard}>
              <Text style={styles.chartTitle}>Arus Transaksi</Text>

              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={styles.incomeSwatch} />
                  <Text style={styles.legendText}>Pemasukan</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={styles.expenseSwatch} />
                  <Text style={styles.legendText}>Pengeluaran</Text>
                </View>
              </View>

              <View style={styles.chartContainer}>
                <Svg
                  width="100%"
                  height="180"
                  viewBox="0 0 300 180"
                  preserveAspectRatio="none"
                >
                  <Path
                    d={incomePath.area}
                    fill={colors.primary}
                    fillOpacity={0.16}
                  />
                  <Path
                    d={expensePath.area}
                    fill={colors.secondary}
                    fillOpacity={0.12}
                  />
                  <Path
                    d={incomePath.line}
                    stroke={colors.primary}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <Path
                    d={expensePath.line}
                    stroke={colors.secondary}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
              </View>

              <View style={styles.dayLabels}>
                {chartDays.map((date, index) => (
                  <Text key={index} style={styles.dayLabel}>
                    {date
                      .toLocaleDateString('id-ID', {
                        weekday: 'short',
                      })
                      .replace('.', '')}
                  </Text>
                ))}
              </View>

              <View style={styles.summary}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Pemasukan</Text>
                  <Text style={styles.incomeValue} numberOfLines={1}>
                    {formatAmount(dashboard.income)}
                  </Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Pengeluaran</Text>
                  <Text style={styles.expenseValue} numberOfLines={1}>
                    {formatAmount(dashboard.expense)}
                  </Text>
                </View>
              </View>

              <View style={styles.statusSummary}>
                <View>
                  <Text style={styles.statusNumber}>
                    {dashboard.pending}
                  </Text>
                  <Text style={styles.summaryLabel}>Pending</Text>
                </View>

                <View style={styles.statusRight}>
                  <Text style={styles.statusNumber}>
                    {dashboard.sent}
                  </Text>
                  <Text style={styles.summaryLabel}>Terkirim</Text>
                </View>
              </View>
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>Transaksi</Text>
              <Text style={styles.transactionCount}>
                {transactions.length}
              </Text>
            </View>

            {loading && (
              <View style={styles.state}>
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                />
                <Text style={styles.stateText}>
                  Memuat transaksi...
                </Text>
              </View>
            )}

            {!loading && error !== '' && (
              <Pressable
                onPress={() => void loadTransactions()}
                style={styles.state}
              >
                <Text style={styles.stateText}>{error}</Text>
                <Text style={styles.retry}>Ketuk untuk mencoba lagi</Text>
              </Pressable>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <View style={styles.transactionIcon}>
              <ExternalLink size={19} color={colors.textMuted} />
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {item.type === 'receive' ? 'Terima' : 'Kirim'}{' '}
                {item.tokenSymbol}
              </Text>
              <Text style={styles.network}>{item.network}</Text>
              <Text style={styles.date}>
                {formatDate(item.createdAt)}
              </Text>
              <Text style={styles.recipient}>
                {shorten(item.recipient)}
              </Text>
            </View>

            <View style={styles.amountColumn}>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type === 'receive' && styles.receiveAmount,
                ]}
                numberOfLines={1}
              >
                {item.type === 'receive' ? '+' : '−'}
                {item.amount}
              </Text>

              <Text style={styles.tokenSymbol}>{item.tokenSymbol}</Text>

              <Text
                style={[
                  styles.statusText,
                  item.status === 'success' && styles.successText,
                  item.status === 'pending' && styles.pendingText,
                  item.status === 'failed' && styles.failedText,
                ]}
              >
                {statusLabel[item.status]}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'relative',
    height: 56,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerGradient: {
    position: 'absolute',
    top: -20,
    left: -spacing.md,
    right: -spacing.md,
    height: 120,
  },
  headerButton: {
    position: 'absolute',
    top: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  leftButton: {
    left: spacing.md,
  },
  rightButton: {
    right: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 110,
    flexGrow: 1,
  },
  dashboard: {
    padding: 24,
    marginTop: 8,
    marginBottom: 28,
    borderRadius: 32,
    backgroundColor: colors.surface,
  },
  chartTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  incomeSwatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  expenseSwatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  chartContainer: {
    height: 180,
    marginTop: 18,
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    width: 28,
  },
  summary: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  summaryItem: {
    flex: 1,
    gap: 7,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  incomeValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  expenseValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  statusRight: {
    alignItems: 'flex-end',
  },
  statusNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  transactionCount: {
    color: colors.textMuted,
    fontSize: 12,
  },
  itemSpacing: {
    height: 18,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 8,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  network: {
    color: colors.textMuted,
    fontSize: 11,
  },
  date: {
    color: colors.textMuted,
    fontSize: 10,
  },
  recipient: {
    color: colors.textMuted,
    fontSize: 10,
  },
  amountColumn: {
    alignItems: 'flex-end',
    gap: 4,
    maxWidth: 112,
  },
  transactionAmount: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  receiveAmount: {
    color: colors.primary,
  },
  tokenSymbol: {
    color: colors.textMuted,
    fontSize: 11,
  },
  statusText: {
    fontSize: 11,
  },
  successText: {
    color: colors.primary,
  },
  pendingText: {
    color: '#F59E0B',
  },
  failedText: {
    color: '#F87171',
  },
  state: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stateText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  retry: {
    color: colors.secondary,
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
