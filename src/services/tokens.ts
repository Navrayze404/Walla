import type { TokenBalance } from '../types/token';

const ALCHEMY_API_KEY = process.env.EXPO_PUBLIC_ALCHEMY_API_KEY;

const NETWORKS = [
  'eth-mainnet',
  'base-mainnet',
  'arb-mainnet',
  'opt-mainnet',
  'matic-mainnet',
  'bnb-mainnet',
  'avax-mainnet',
  'eth-sepolia',
];

const CHAIN_IDS: Record<string, number> = {
  'eth-mainnet': 1,
  'base-mainnet': 8453,
  'arb-mainnet': 42161,
  'opt-mainnet': 10,
  'matic-mainnet': 137,
  'bnb-mainnet': 56,
  'avax-mainnet': 43114,
  'eth-sepolia': 11155111,
};

type AlchemyToken = {
  network: string;
  tokenAddress: string | null;
  tokenBalance: string;
  tokenMetadata?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    logo?: string;
  };
  tokenPrices?: Array<{
    currency: string;
    value: string;
  }>;
};

type AlchemyPartialError = {
  network?: string;
  message?: string;
};

type AlchemyResponse = {
  data?: {
    tokens?: AlchemyToken[];
    pageKey?: string;
  };
  error?: {
    partialErrors?: AlchemyPartialError[];
  };
};

function formatTokenBalance(
  balance: string,
  decimals: number,
): string {
  const raw = BigInt(balance);
  const divisor = 10n ** BigInt(decimals);

  const whole = raw / divisor;
  const fraction = raw % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionString = fraction
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '');

  return `${whole}.${fractionString}`;
}

async function fetchNetworkBatch(
  walletAddress: string,
  networks: string[],
): Promise<AlchemyToken[]> {
  const tokens: AlchemyToken[] = [];
  let pageKey: string | undefined;

  do {
    const response = await fetch(
      `https://api.g.alchemy.com/data/v1/${ALCHEMY_API_KEY}/assets/tokens/by-address`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addresses: [
            {
              address: walletAddress,
              networks,
            },
          ],
          ...(pageKey ? { pageKey } : {}),
          withMetadata: true,
          withPrices: true,
          includeNativeTokens: true,
          includeErc20Tokens: true,
          includeBlockMetadata: false,
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();

      console.error(
        'ALCHEMY ERROR:',
        response.status,
        errorBody,
      );

      throw new Error(
        `Alchemy request failed: ${response.status}`,
      );
    }

    const data: AlchemyResponse = await response.json();

    console.log(
      'ALCHEMY RESPONSE:',
      JSON.stringify(data, null, 2),
    );

    if (data.error?.partialErrors?.length) {
      console.warn(
        'ALCHEMY PARTIAL ERRORS:',
        data.error.partialErrors,
      );
    }

    tokens.push(...(data.data?.tokens ?? []));

    pageKey = data.data?.pageKey;
  } while (pageKey);

  return tokens;
}

export async function getTokenBalances(
  walletAddress: string,
): Promise<TokenBalance[]> {
  if (!ALCHEMY_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_ALCHEMY_API_KEY');
  }

  const networkBatches: string[][] = [];

  for (let i = 0; i < NETWORKS.length; i += 5) {
    networkBatches.push(NETWORKS.slice(i, i + 5));
  }

  const results = await Promise.all(
    networkBatches.map((networks) =>
      fetchNetworkBatch(walletAddress, networks),
    ),
  );

  const allTokens = results.flat();

  return allTokens
    .filter((token) => {
      const decimals = token.tokenMetadata?.decimals;

      if (
        typeof token.tokenBalance !== 'string' ||
        typeof decimals !== 'number' ||
        !Number.isInteger(decimals)
      ) {
        return false;
      }

      return BigInt(token.tokenBalance) > 0n;
    })
    .map((token) => {
      const decimals = token.tokenMetadata!.decimals!;

      const balanceFormatted = formatTokenBalance(
        token.tokenBalance,
        decimals,
      );

      const priceUsd = Number(
        token.tokenPrices?.find(
          (price) =>
            price.currency.toLowerCase() === 'usd',
        )?.value ?? 0,
      );

      return {
        chainId: CHAIN_IDS[token.network],
        address: token.tokenAddress ?? 'native',
        symbol: token.tokenMetadata?.symbol ?? 'UNKNOWN',
        name: token.tokenMetadata?.name ?? 'Unknown Token',
        decimals,
        balance: token.tokenBalance,
        balanceFormatted,
        priceUsd,
        valueUsd: Number(balanceFormatted) * priceUsd,
        logoUri: token.tokenMetadata?.logo,
      };
    })
    .filter(
      (token) =>
        typeof token.chainId === 'number',
    );
}
