import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveWallet } from './wallet';

const STATUS_STORAGE_KEY = '@walla/statuses';
const STATUS_DURATION_MS = 24 * 60 * 60 * 1000;

export type StatusMediaType = 'image' | 'video';

export type Status = {
  id: string;
  walletId: string;
  walletAddress: string;
  mediaUri: string;
  mediaType: StatusMediaType;
  caption?: string;
  createdAt: number;
  expiresAt: number;
};

type CreateStatusParams = {
  mediaUri: string;
  mediaType: StatusMediaType;
  caption?: string;
};

function createStatusId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

async function getStoredStatuses(): Promise<Status[]> {
  const raw = await AsyncStorage.getItem(
    STATUS_STORAGE_KEY,
  );

  if (!raw) {
    return [];
  }

  try {
    const parsed: Status[] = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

async function saveStatuses(
  statuses: Status[],
): Promise<void> {
  await AsyncStorage.setItem(
    STATUS_STORAGE_KEY,
    JSON.stringify(statuses),
  );
}

function removeExpiredStatuses(
  statuses: Status[],
): Status[] {
  const now = Date.now();

  return statuses.filter(
    (status) => status.expiresAt > now,
  );
}

export async function createStatus({
  mediaUri,
  mediaType,
  caption,
}: CreateStatusParams): Promise<Status> {
  if (!mediaUri.trim()) {
    throw new Error('Status media is required');
  }

  const wallet = await getActiveWallet();

  if (!wallet) {
    throw new Error('No active wallet found');
  }

  const now = Date.now();

  const status: Status = {
    id: createStatusId(),
    walletId: wallet.id,
    walletAddress: wallet.address,
    mediaUri,
    mediaType,
    ...(caption?.trim()
      ? { caption: caption.trim() }
      : {}),
    createdAt: now,
    expiresAt: now + STATUS_DURATION_MS,
  };

  const existingStatuses =
    await getStoredStatuses();

  const activeStatuses =
    removeExpiredStatuses(existingStatuses);

  await saveStatuses([
    status,
    ...activeStatuses,
  ]);

  return status;
}

export async function getActiveStatuses(): Promise<
  Status[]
> {
  const statuses = await getStoredStatuses();

  const activeStatuses =
    removeExpiredStatuses(statuses);

  if (activeStatuses.length !== statuses.length) {
    await saveStatuses(activeStatuses);
  }

  return activeStatuses;
}

export async function getMyStatuses(): Promise<
  Status[]
> {
  const wallet = await getActiveWallet();

  if (!wallet) {
    return [];
  }

  const statuses = await getActiveStatuses();

  return statuses.filter(
    (status) => status.walletId === wallet.id,
  );
}

export async function deleteStatus(
  statusId: string,
): Promise<void> {
  const statuses = await getActiveStatuses();

  const nextStatuses = statuses.filter(
    (status) => status.id !== statusId,
  );

  await saveStatuses(nextStatuses);
}

export function getStatusRemainingMs(
  status: Status,
): number {
  return Math.max(
    0,
    status.expiresAt - Date.now(),
  );
}