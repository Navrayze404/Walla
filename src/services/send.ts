import {
  Contract,
  JsonRpcProvider,
  Wallet,
  parseEther,
  parseUnits,
} from 'ethers';

import { getActiveWallet } from './wallet';

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

type SendNativeParams = {
  recipient: string;
  amount: string;
  rpcUrl: string;
};

type SendTokenParams = {
  recipient: string;
  amount: string;
  tokenAddress: string;
  rpcUrl: string;
};

async function getSigner(rpcUrl: string) {
  const activeWallet = await getActiveWallet();

  if (!activeWallet) {
    throw new Error('No active wallet found');
  }

  if (!activeWallet.privateKey) {
    throw new Error('Active wallet private key not found');
  }

  const provider = new JsonRpcProvider(rpcUrl);

  return new Wallet(
    activeWallet.privateKey,
    provider,
  );
}

export async function sendNativeToken({
  recipient,
  amount,
  rpcUrl,
}: SendNativeParams): Promise<string> {
  const signer = await getSigner(rpcUrl);

  const transaction = await signer.sendTransaction({
    to: recipient,
    value: parseEther(amount),
  });

  return transaction.hash;
}

export async function sendErc20Token({
  recipient,
  amount,
  tokenAddress,
  rpcUrl,
}: SendTokenParams): Promise<string> {
  const signer = await getSigner(rpcUrl);

  const tokenContract = new Contract(
    tokenAddress,
    ERC20_ABI,
    signer,
  );

  const decimals = await tokenContract.decimals();
  const parsedAmount = parseUnits(amount, decimals);

  const transaction = await tokenContract.transfer(
    recipient,
    parsedAmount,
  );

  return transaction.hash;
}