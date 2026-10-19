import 'react-native-get-random-values';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = '@walla_private_key';

export const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  await AsyncStorage.setItem(WALLET_KEY, wallet.privateKey);
  return { address: wallet.address, mnemonic: wallet.mnemonic?.phrase };
};

export const getStoredWallet = async (providerUrl: string) => {
  const privKey = await AsyncStorage.getItem(WALLET_KEY);
  if (!privKey) return null;
  const provider = new ethers.JsonRpcProvider(providerUrl);
  return new ethers.Wallet(privKey, provider);
};

export const sendTransaction = async (providerUrl: string, to: string, amountEth: string) => {
  const wallet = await getStoredWallet(providerUrl);
  if (!wallet) throw new Error("Wallet tidak ditemukan");
  
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth)
  });
  return tx.wait();
};