import AsyncStorage from '@react-native-async-storage/async-storage';

const SNAPSHOT_KEY = '@walla_daily_portfolio_snapshot';

type DailySnapshot = {
  date: string;
  valueUsd: number;
};

const getTodayKey = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDailyPortfolioSnapshot = async (
  currentValueUsd: number,
): Promise<DailySnapshot> => {
  const today = getTodayKey();
  const stored = await AsyncStorage.getItem(SNAPSHOT_KEY);

  if (stored) {
    try {
      const snapshot: DailySnapshot = JSON.parse(stored);

      if (snapshot.date === today) {
        return snapshot;
      }
    } catch {
      // Ignore invalid snapshot and recreate it.
    }
  }

  const snapshot: DailySnapshot = {
    date: today,
    valueUsd: currentValueUsd,
  };

  await AsyncStorage.setItem(
    SNAPSHOT_KEY,
    JSON.stringify(snapshot),
  );

  return snapshot;
};

export const calculateDailyPnl = (
  currentValueUsd: number,
  startValueUsd: number,
) => {
  if (startValueUsd <= 0) {
    return {
      amountUsd: 0,
      percentage: 0,
    };
  }

  const amountUsd =
    currentValueUsd - startValueUsd;

  const percentage =
    (amountUsd / startValueUsd) * 100;

  return {
    amountUsd,
    percentage,
  };
};