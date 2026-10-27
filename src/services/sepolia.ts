import { ethers } from 'ethers';
import type { TokenBalance } from '../types/token';

const ALCHEMY_API_KEY = process.env.EXPO_PUBLIC_ALCHEMY_API_KEY;

export async function getSepoliaBalance(
  walletAddress: string,
): Promise<TokenBalance> {
  if (!ALCHEMY_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_ALCHEMY_API_KEY');
  }

  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  );

  const balance = await provider.getBalance(walletAddress);
  const balanceFormatted = ethers.formatEther(balance);

  return {
    chainId: 11155111,
    address: 'native',
    symbol: 'ETH',
    name: 'Ethereum Sepolia',
    decimals: 18,
    balance: balance.toString(),
    balanceFormatted,
    priceUsd: 0,
    valueUsd: 0,
  };
}