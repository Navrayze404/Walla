
export type TransactionStatus =
  | 'pending'
  | 'success'
  | 'failed';

export type WalletTransaction = {
  id: string;
  hash: string;
  type: 'send' | 'receive';
  recipient: string;
  tokenSymbol: string;
  amount: string;
  chainId: number;
  network: string;
  status: TransactionStatus;
  createdAt: number;
};
