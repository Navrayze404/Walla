export const getSwapQuote = async (
  fromChain: string, 
  toChain: string, 
  fromToken: string, 
  toToken: string, 
  fromAmount: string, 
  userAddress: string
) => {
  const params = new URLSearchParams({
    fromChain,
    toChain,
    fromToken,
    toToken,
    fromAmount,
    fromAddress: userAddress,
  });

  const res = await fetch(`https://li.quest/v1/quote?${params.toString()}`);
  if (!res.ok) throw new Error('Gagal mengambil route swap');
  return res.json();
};