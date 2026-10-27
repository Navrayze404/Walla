export type TokenBalance = {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  priceUsd: number;
  valueUsd: number;
  logoUri?: string;
};