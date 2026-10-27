import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TokenBalance } from '../types/token';

const TOKEN_VISIBILITY_KEY = '@walla_visible_tokens';

function getTokenKey(token: TokenBalance): string {
  return `${token.chainId}-${token.address}`;
}

export async function getHiddenTokenKeys(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(TOKEN_VISIBILITY_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function setTokenVisibility(
  token: TokenBalance,
  visible: boolean,
): Promise<void> {
  const hiddenTokens = await getHiddenTokenKeys();
  const key = getTokenKey(token);

  const nextHiddenTokens = visible
    ? hiddenTokens.filter((item) => item !== key)
    : hiddenTokens.includes(key)
      ? hiddenTokens
      : [...hiddenTokens, key];

  await AsyncStorage.setItem(
    TOKEN_VISIBILITY_KEY,
    JSON.stringify(nextHiddenTokens),
  );
}

export async function filterVisibleTokens(
  tokens: TokenBalance[],
): Promise<TokenBalance[]> {
  const hiddenTokens = await getHiddenTokenKeys();

  return tokens.filter(
    (token) => !hiddenTokens.includes(getTokenKey(token)),
  );
}

export async function isTokenVisible(
  token: TokenBalance,
): Promise<boolean> {
  const hiddenTokens = await getHiddenTokenKeys();

  return !hiddenTokens.includes(getTokenKey(token));
}