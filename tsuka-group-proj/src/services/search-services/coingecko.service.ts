import { SearchToken } from '@/types';
import axios from 'axios';
import { checkIfTokenIsErc20 } from './etherscan.service';
import { checkIfTokenIsOnUniswap } from './uniswap.service';

// Simple in-memory cache
const cache = {
  data: [],
  lastFetch: 0,
  expiresIn: 5 * 60 * 1000, // Cache expires in 5 minutes
};

export async function searchTokensByName(name: string): Promise<SearchToken[]> {
  try {
    const now = Date.now();
    // Check if data is cached and still valid
    if (cache.data.length === 0 || now - cache.lastFetch > cache.expiresIn) {
      console.log("New api request going:::::::")
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true');

      cache.data = response.data;
      cache.lastFetch = now;
    }
    const tokens = cache.data.filter((coin: any) => coin.name.toLowerCase().includes(name.toLowerCase()));

    const erc20Tokens: (SearchToken | null)[] = await Promise.all(tokens.map(async (coin: any) => {
      const id = coin.id;
      const tokenName = coin.name;
      const symbol = coin.symbol;
      const address = coin.platforms.ethereum;

      if (!address) {
        return null;
      }

      const isErc20 = await checkIfTokenIsErc20(address);
      // const isErc20 = true;
      const isOnUniswap = await checkIfTokenIsOnUniswap(address);

      if (isErc20 && isOnUniswap) {
        return {
          id,
          name: tokenName,
          symbol,
          address,
        } as SearchToken;
      }

      return null;
    }));

    const erc20Tokens1: SearchToken[] = erc20Tokens.filter(isSearchToken);
    return erc20Tokens1;
  } catch (error) {
    console.error(`Error searching tokens by name: ${error}`);
    return [];
  }
}

function isSearchToken(token: SearchToken | null): token is SearchToken {
  return token !== null;
}