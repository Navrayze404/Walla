
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  WalletTransaction,
  TransactionStatus,
} from '../types/transaction';

const STORAGE_KEY = '@walla_transaction_history';

export async function getTransactionHistory(): Promise<
  WalletTransaction[]
> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as WalletTransaction[];
  } catch {
    throw new Error(
      'Riwayat transaksi gagal dimuat.',
    );
  }
}

export async function saveTransaction(
  transaction: WalletTransaction,
): Promise<void> {
  const history = await getTransactionHistory();

  const existingIndex = history.findIndex(
    (item) => item.id === transaction.id,
  );

  if (existingIndex >= 0) {
    history[existingIndex] = transaction;
  } else {
    history.unshift(transaction);
  }

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history),
  );
}

export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus,
): Promise<void> {
  const history = await getTransactionHistory();

  const index = history.findIndex(
    (item) => item.id === id,
  );

  if (index < 0) {
    throw new Error(
      'Transaksi tidak ditemukan dalam riwayat.',
    );
  }

  history[index] = {
    ...history[index],
    status,
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history),
  );
}
