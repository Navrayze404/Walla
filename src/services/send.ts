
import {
  Contract,
  JsonRpcProvider,
  Wallet,
  isAddress,
  parseEther,
  parseUnits,
} from 'ethers';

import { getActiveWallet } from './wallet';

const ALCHEMY_API_KEY =
  process.env.EXPO_PUBLIC_ALCHEMY_API_KEY;

const ALCHEMY_NETWORKS: Record<number, string> = {
  1: 'eth-mainnet',
  8453: 'base-mainnet',
  42161: 'arb-mainnet',
  10: 'opt-mainnet',
  137: 'polygon-mainnet',
  56: 'bnb-mainnet',
  43114: 'avax-mainnet',
  11155111: 'eth-sepolia',
};

export function getRpcUrl(chainId: number): string {
  if (!ALCHEMY_API_KEY) {
    throw new Error(
      'Konfigurasi jaringan belum tersedia. Coba lagi nanti.',
    );
  }

  const network = ALCHEMY_NETWORKS[chainId];

  if (!network) {
    throw new Error(
      'Jaringan ini belum didukung.',
    );
  }

  return `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
}

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

type SendNativeParams = {
  recipient: string;
  amount: string;
  rpcUrl: string;
  chainId: number;
};

type SendTokenParams = {
  recipient: string;
  amount: string;
  tokenAddress: string;
  rpcUrl: string;
  chainId: number;
};

async function getSigner(
  rpcUrl: string,
  expectedChainId: number,
) {
  const activeWallet = await getActiveWallet();

  if (!activeWallet?.privateKey) {
    throw new Error(
      'Dompet tidak ditemukan. Silakan buka atau buat dompet terlebih dahulu.',
    );
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== expectedChainId) {
    throw new Error(
      'Jaringan dompet tidak sesuai. Periksa jaringan yang dipilih.',
    );
  }

  return new Wallet(
    activeWallet.privateKey,
    provider,
  );
}

function validateAmount(amount: string): void {
  if (
    !amount.trim() ||
    !/^\d+(\.\d+)?$/.test(amount.trim()) ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    throw new Error(
      'Masukkan jumlah aset yang valid dan lebih besar dari nol.',
    );
  }
}

export async function sendNativeToken({
  recipient,
  amount,
  rpcUrl,
  chainId,
}: SendNativeParams): Promise<string> {
  if (!isAddress(recipient)) {
    throw new Error(
      'Alamat penerima tidak valid. Periksa kembali alamatnya.',
    );
  }

  validateAmount(amount);

  const signer = await getSigner(rpcUrl, chainId);
  const provider = signer.provider;

  if (!provider) {
    throw new Error(
      'Koneksi jaringan tidak tersedia. Coba lagi.',
    );
  }

  const value = parseEther(amount);
  const sender = await signer.getAddress();

  let balance: bigint;
  let gasLimit: bigint;

  try {
    balance = await provider.getBalance(sender);

    gasLimit = await provider.estimateGas({
      from: sender,
      to: recipient,
      value,
    });
  } catch {
    throw new Error(
      'Gagal memeriksa saldo atau biaya jaringan. Periksa koneksi dan coba lagi.',
    );
  }

  const feeData = await provider.getFeeData();
  const feePerGas =
    feeData.maxFeePerGas ?? feeData.gasPrice;

  if (feePerGas === null) {
    throw new Error(
      'Biaya jaringan belum bisa dihitung. Coba lagi.',
    );
  }

  const estimatedGasCost = gasLimit * feePerGas;

  if (balance < value + estimatedGasCost) {
    throw new Error(
      'Saldo tidak cukup untuk mengirim aset dan membayar biaya jaringan.',
    );
  }

  const transaction = await signer.sendTransaction({
    to: recipient,
    value,
    gasLimit,
  });

  return transaction.hash;
}

export async function sendErc20Token({
  recipient,
  amount,
  tokenAddress,
  rpcUrl,
  chainId,
}: SendTokenParams): Promise<string> {
  if (!isAddress(recipient)) {
    throw new Error(
      'Alamat penerima tidak valid. Periksa kembali alamatnya.',
    );
  }

  if (!isAddress(tokenAddress)) {
    throw new Error(
      'Kontrak aset tidak valid.',
    );
  }

  validateAmount(amount);

  const signer = await getSigner(rpcUrl, chainId);
  const provider = signer.provider;

  if (!provider) {
    throw new Error(
      'Koneksi jaringan tidak tersedia. Coba lagi.',
    );
  }

  const sender = await signer.getAddress();

  const tokenContract = new Contract(
    tokenAddress,
    ERC20_ABI,
    signer,
  );

  let decimals: number;
  let tokenBalance: bigint;
  let gasLimit: bigint;

  try {
    decimals = Number(await tokenContract.decimals());

    if (
      !Number.isInteger(decimals) ||
      decimals < 0 ||
      decimals > 255
    ) {
      throw new Error('Invalid token decimals');
    }

    const parsedAmount = parseUnits(amount, decimals);

    tokenBalance = await tokenContract.balanceOf(sender);

    if (tokenBalance < parsedAmount) {
      throw new Error(
        'Saldo aset tidak cukup untuk jumlah yang ingin dikirim.',
      );
    }

    gasLimit = await provider.estimateGas({
      from: sender,
      to: tokenAddress,
      data: tokenContract.interface.encodeFunctionData(
        'transfer',
        [recipient, parsedAmount],
      ),
    });

    const feeData = await provider.getFeeData();
    const feePerGas =
      feeData.maxFeePerGas ?? feeData.gasPrice;

    if (feePerGas === null) {
      throw new Error(
        'Biaya jaringan belum bisa dihitung. Coba lagi.',
      );
    }

    const estimatedGasCost = gasLimit * feePerGas;
    const nativeBalance = await provider.getBalance(sender);

    if (nativeBalance < estimatedGasCost) {
      throw new Error(
        'Saldo untuk biaya jaringan tidak cukup. Kamu perlu aset jaringan ini untuk membayar biaya pengiriman.',
      );
    }

    const transaction = await tokenContract.transfer(
      recipient,
      parsedAmount,
      { gasLimit },
    );

    return transaction.hash;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('Saldo aset tidak cukup') ||
        error.message.includes('Saldo untuk biaya jaringan') ||
        error.message.includes('Biaya jaringan belum bisa')
      ) {
        throw error;
      }

      if (
        error.message.includes('could not decode result data') ||
        error.message.includes('BAD_DATA')
      ) {
        throw new Error(
          'Aset tidak dapat diperiksa pada jaringan ini.',
        );
      }
    }

    throw new Error(
      'Pengiriman gagal diproses. Periksa aset, jaringan, dan koneksi lalu coba lagi.',
    );
  }
}


export async function waitForTransaction(
  txHash: string,
  rpcUrl: string,
): Promise<void> {
  const provider = new JsonRpcProvider(rpcUrl);

  let receipt;

  try {
    receipt = await provider.waitForTransaction(
      txHash,
      1,
      120_000,
    );
  } catch {
    throw new Error(
      'Gagal memeriksa status transaksi. Periksa riwayat transaksi untuk mengetahui status terbarunya.',
    );
  }

  if (!receipt) {
    throw new Error(
      'Transaksi belum dikonfirmasi. Periksa riwayat transaksi sebelum mencoba mengirim ulang.',
    );
  }

  if (receipt.status !== 1) {
    throw new Error(
      'Transaksi gagal di blockchain. Biaya jaringan mungkin tetap terpotong.',
    );
  }
}
