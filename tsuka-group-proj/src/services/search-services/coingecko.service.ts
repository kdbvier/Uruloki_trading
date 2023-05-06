import axios from 'axios';
import { checkIfTokenIsErc20 } from './etherscan.service';
import { checkIfTokenIsOnUniswap } from './uniswap.service';

// Simple in-memory cache
const cache = {
  data: [],
  lastFetch: 0,
  expiresIn: 5 * 60 * 1000, // Cache expires in 5 minutes
};

export async function searchTokensByName(name: string): Promise<any[]> {
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

    const erc20Tokens = await Promise.all(tokens.map(async (coin: any) => {
      const id = coin.id;
      const tokenName = coin.name;
      const symbol = coin.symbol;
      const platform = coin.platforms.ethereum;

      if (!platform) {
        return null;
      }

      const isErc20 = await checkIfTokenIsErc20(platform);
      const isOnUniswap = await checkIfTokenIsOnUniswap(platform);

      if (isErc20 && isOnUniswap) {
        return {
          id,
          name: tokenName,
          symbol,
          platform,
        };
      }

      return null;
    }));

    return erc20Tokens.filter((token: any) => token);
  } catch (error) {
    console.error(`Error searching tokens by name: ${error}`);
    return [];
  }
}
