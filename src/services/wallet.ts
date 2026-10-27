import 'react-native-get-random-values';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OLD_WALLET_KEY = '@walla_private_key';
const WALLETS_KEY = '@walla_wallets';
const ACTIVE_WALLET_KEY = '@walla_active_wallet';

export type WalletIcon =
  | 'wallet'
  | 'user'
  | 'shield'
  | 'gem'
  | 'star'
  | 'heart'
  | 'hexagon'
  | 'photo';

export type StoredWallet = {
  id: string;
  name: string;
  privateKey: string;
  address: string;
  mnemonic?: string;
  icon?: WalletIcon;
};

const getWallets = async (): Promise<StoredWallet[]> => {
  const stored = await AsyncStorage.getItem(WALLETS_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  const oldPrivateKey = await AsyncStorage.getItem(OLD_WALLET_KEY);

  if (!oldPrivateKey) {
    return [];
  }

  try {
    const wallet = new ethers.Wallet(oldPrivateKey);

    const migratedWallet: StoredWallet = {
      id: 'wallet-1',
      name: 'Wallet 1',
      privateKey: wallet.privateKey,
      address: wallet.address,
      icon: 'wallet',
    };

    await AsyncStorage.setItem(
      WALLETS_KEY,
      JSON.stringify([migratedWallet]),
    );

    await AsyncStorage.setItem(
      ACTIVE_WALLET_KEY,
      migratedWallet.id,
    );

    return [migratedWallet];
  } catch {
    return [];
  }
};

const saveWallets = async (
  wallets: StoredWallet[],
) => {
  await AsyncStorage.setItem(
    WALLETS_KEY,
    JSON.stringify(wallets),
  );
};

const addWallet = async (
  wallet: ethers.Wallet | ethers.HDNodeWallet,
  mnemonic?: string,
): Promise<StoredWallet> => {
  const wallets = await getWallets();

  const storedWallet: StoredWallet = {
    id: `wallet-${Date.now()}`,
    name: `Wallet ${wallets.length + 1}`,
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic,
    icon: 'wallet',
  };

  const nextWallets = [
    ...wallets,
    storedWallet,
  ];

  await saveWallets(nextWallets);

  await AsyncStorage.setItem(
    ACTIVE_WALLET_KEY,
    storedWallet.id,
  );

  return storedWallet;
};

export const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic?.phrase;

  const storedWallet = await addWallet(
    wallet,
    mnemonic,
  );

  return {
    address: storedWallet.address,
    mnemonic,
  };
};

export const importWallet = async (
  privateKey?: string,
  seedPhrase?: string,
) => {
  const wallet = seedPhrase?.trim()
    ? ethers.Wallet.fromPhrase(seedPhrase.trim())
    : privateKey?.trim()
      ? new ethers.Wallet(privateKey.trim())
      : null;

  if (!wallet) {
    throw new Error(
      'Private key atau seed phrase diperlukan',
    );
  }

  const storedWallet = await addWallet(
    wallet,
    seedPhrase?.trim(),
  );

  return {
    address: storedWallet.address,
  };
};

export const getStoredWallets = async () =>
  getWallets();

export const getActiveWallet = async () => {
  const wallets = await getWallets();

  if (wallets.length === 0) {
    return null;
  }

  const activeWalletId =
    await AsyncStorage.getItem(
      ACTIVE_WALLET_KEY,
    );

  if (!activeWalletId) {
    return wallets[0];
  }

  return (
    wallets.find(
      (wallet) =>
        wallet.id === activeWalletId,
    ) ?? wallets[0]
  );
};

export const getWalletSeedPhrase = async (
  walletId: string,
) => {
  const wallets = await getWallets();

  const wallet = wallets.find(
    (item) => item.id === walletId,
  );

  if (!wallet) {
    throw new Error(
      'Wallet tidak ditemukan',
    );
  }

  if (!wallet.mnemonic) {
    throw new Error(
      'Seed phrase tidak tersedia untuk wallet ini',
    );
  }

  return wallet.mnemonic;
};

export const setActiveWallet = async (
  walletId: string,
) => {
  const wallets = await getWallets();

  const walletExists = wallets.some(
    (wallet) => wallet.id === walletId,
  );

  if (!walletExists) {
    throw new Error(
      'Wallet tidak ditemukan',
    );
  }

  await AsyncStorage.setItem(
    ACTIVE_WALLET_KEY,
    walletId,
  );
};

export const updateWalletIcon = async (
  walletId: string,
  icon: WalletIcon,
) => {
  const wallets = await getWallets();

  const walletExists = wallets.some(
    (wallet) => wallet.id === walletId,
  );

  if (!walletExists) {
    throw new Error(
      'Wallet tidak ditemukan',
    );
  }

  const updatedWallets = wallets.map(
    (wallet) =>
      wallet.id === walletId
        ? { ...wallet, icon }
        : wallet,
  );

  await saveWallets(updatedWallets);
};

export const updateWalletName = async (
  walletId: string,
  name: string,
) => {
  const wallets = await getWallets();

  const walletExists = wallets.some(
    (wallet) => wallet.id === walletId,
  );

  if (!walletExists) {
    throw new Error(
      'Wallet tidak ditemukan',
    );
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error(
      'Nama wallet tidak boleh kosong',
    );
  }

  const updatedWallets = wallets.map(
    (wallet) =>
      wallet.id === walletId
        ? {
            ...wallet,
            name: trimmedName,
          }
        : wallet,
  );

  await saveWallets(updatedWallets);
};

export const getStoredWallet = async (
  providerUrl: string,
) => {
  const wallet = await getActiveWallet();

  if (!wallet) {
    return null;
  }

  const provider =
    new ethers.JsonRpcProvider(
      providerUrl,
    );

  return new ethers.Wallet(
    wallet.privateKey,
    provider,
  );
};

export const sendTransaction = async (
  providerUrl: string,
  to: string,
  amountEth: string,
) => {
  const wallet =
    await getStoredWallet(providerUrl);

  if (!wallet) {
    throw new Error(
      'Wallet tidak ditemukan',
    );
  }

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth),
  });

  return tx.wait();
};

export const getStoredWalletAddress =
  async () => {
    const wallet =
      await getActiveWallet();

    return wallet?.address ?? null;
  };