import { SearchToken } from '@/types';
import axios from 'axios';
import { checkIfTokenIsErc20 } from './etherscan.service';
import { checkIfTokenIsOnUniswap } from './uniswap.service';
import DataCache from '@/lib/caching/data-cache';

export async function searchTokensByName(name: string): Promise<SearchToken[]> {
  try {
    const now = Date.now();
    let data: any;
    const cacheReq = await DataCache.getIfFresh('coingeko-all-tokens');
    // Check if data is cached and still valid
    if (cacheReq.stale) {
      console.log("Writing data to cache")
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true');
      await DataCache.addToCache(response.data, 'coingeko-all-tokens', 60 * 60 * 6); //6hr ttl
      data = response.data;
    } else {
      console.log("Data already in cache")
      data = cacheReq.data.cached_data;
    }
    const tokens = data
      .filter((coin: any) => coin.name.toLowerCase().includes(name.toLowerCase())||coin.symbol.toLowerCase().includes(name.toLowerCase()))
      .sort((a: any, b: any) => {
        if(a.name.toLowerCase().startsWith(name.toLowerCase()))
          return -1; // move a to the front
        if(b.name.toLowerCase().startsWith(name.toLowerCase()))          
          return 1; // move b to the front
        if(b.name.toLowerCase() > a.name.toLowerCase())
          return -1; // move a to the front
        if(b.name.toLowerCase() < a.name.toLowerCase())
          return 1; // move b to the front
        return 0; // keep the order of a and b unchanged
      });
    const erc20Tokens: (SearchToken | null)[] = await Promise.all(tokens.map(async (coin: any) => {
      const id = coin.id;
      const tokenName = coin.name;
      const symbol = coin.symbol;
      const address = coin.platforms.ethereum;
      
      // const isErc20 = await checkIfTokenIsErc20(address);
      const isErc20 = true;
      const isOnUniswap = await checkIfTokenIsOnUniswap(address);

      if(isErc20 && isOnUniswap)
        return {
          id,
          name: tokenName,
          symbol,
          address,
        } as SearchToken;
      else
       return null;
    }));

    const erc20Tokens1: SearchToken[] = erc20Tokens.filter(isSearchToken).filter(token=>token.address);
    return erc20Tokens1;
  } catch (error) {
    console.error(`Error searching tokens by name: ${error}`);
    return [];
  }
}

function isSearchToken(token: SearchToken | null): token is SearchToken {
  return token !== null;
}