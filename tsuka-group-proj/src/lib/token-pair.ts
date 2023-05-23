import type { TokenPairInfo } from "@/types";
import { G_QUERY_GetTokenPair } from "../pages/api/tokens/g_queries";
import DataCache from '@/lib/caching/data-cache';

export type TokenPairInfoResult = {
    success: boolean;
    tokenPairInfo?: TokenPairInfo;
}

/**
 * Server-Side
 * Gets the two token names from the provided pair address
 * @param pair_address  
 * @returns 
 */
export async function getTokenNamesFromPair(pair_address: string): Promise<TokenPairInfoResult> {
    console.log("tokenPairResponse",pair_address);
    const tokenPairResponse = await G_QUERY_GetTokenPair(
        pair_address as string
    );
    if (!tokenPairResponse.data.data.ethereum.dexTrades[0]) {
        return {success: false}
    }
    const cacheReq = await DataCache.getIfFresh('token-Pair');
    // Check if data is cached and still valid
    if (cacheReq.stale) {
      console.log("Writing data to cache")
      await DataCache.addToCache(tokenPairResponse.data, 'token-Pair', 60 * 60 * 6); //6hr ttl
    } else {
      console.log("Data already in cache")
    }
    const { token0, token1 } = tokenPairResponse.data.data.ethereum.dexTrades[0];
    let baseToken, pairedToken;
    if (
        [
        process.env.WETH_ADDR,
        process.env.DAI_ADDR,
        process.env.USDT_ADDR,
        process.env.USDC_ADDR,
        ].includes(String(token0.address).toLowerCase())
    ) {
        baseToken = token1;
        pairedToken = token0;
    } else {
        baseToken = token0;
        pairedToken = token1;
    }

    return {
        success: true,
        tokenPairInfo: {
            baseToken,
            pairedToken
        }
    }
}
