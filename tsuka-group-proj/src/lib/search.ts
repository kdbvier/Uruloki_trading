
// import axios from 'axios';
// import Fuse from 'fuse.js';

// // Define the CoinGecko API URL for ERC20 tokens
// const API_URL = 'https://api.coingecko.com/api/v3/search/trending';

// export async function fuzzySearchERC20Tokens(searchQuery: string): Promise<any[]> {
//   try {
//     console.log("try:: searchQuery", searchQuery);
//     const response = await axios.get(API_URL);
//     const tokens = response.data.coins;
//     console.log(tokens);

//     // Configure Fuse.js options
//     const fuseOptions: Fuse.IFuseOptions<any> = {
//       keys: ['item.name', 'item.symbol'],
//       includeScore: true,
//       threshold: 0.3,
//     };

//     const fuse = new Fuse(tokens, fuseOptions);
//     console.log("fuse:: " , fuse);
//     const results = fuse.search(searchQuery);

//     console.log("results::");
//     console.log(results);
//     // Map the results to an array of tokens
//     const filteredTokens = results.map((result) => result.item);

//     return filteredTokens;
//   } catch (error) {
//     console.error('Error fetching tokens:', error);
//     return [];
//   }
// }


//////////////////////////////////
// utils/search.ts

import axios from 'axios';
import Fuse from 'fuse.js';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

// Simple in-memory cache
const cache = {
  data: [],
  lastFetch: 0,
  expiresIn: 5 * 60 * 1000, // Cache expires in 5 minutes
};

export async function fuzzySearchERC20Tokens(searchQuery: string): Promise<any[]> {
  try {
    const now = Date.now();

    // Check if data is cached and still valid
    if (cache.data.length === 0 || now - cache.lastFetch > cache.expiresIn) {
      console.log("ldkjfldjfldajfldjfljdflkjglfjldjfladkjfladkjfldkajfldakjsflkdajs");
      const response = await axios.get(API_URL, {
        params: {
          vs_currency: 'usd',
          per_page: 250,
          page: 1,
          order: 'market_cap_desc',
          sparkline: false,
        },
      });

      cache.data = response.data;
      cache.lastFetch = now;
    }

    const tokensData = cache.data;
    console.log("cacheData=",tokensData );

    const fuse = new Fuse(tokensData, {
      keys: ['name', 'symbol'],
      threshold: 0.3,
      includeScore: true,
    });

    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}

// utils/uniswap.ts



// import { request, gql } from 'graphql-request';

// // utils/uniswap.ts

// // ... (other imports)
// const UNISWAP_API_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';


// type Token = {
//   id: string;
//   symbol: string;
//   name: string;
// };

// type Pair = {
//   id: string;
//   token0: Token;
//   token1: Token;
//   createdAtTimestamp: string;
// };

// type UniswapResponse = {
//   pairs: Pair[];
// };

// // utils/uniswap.ts

// // ... (other imports and type definitions)

// export async function fetchRecentTokenPairs(limit: number): Promise<any[]> {
//   const query = gql`
//     query GetRecentlyCreatedPairs($limit: Int!) {
//       pairs(first: $limit, orderBy: createdAtTimestamp, orderDirection: desc) {
//         id
//         token0 {
//           id
//           symbol
//           name
//         }
//         token1 {
//           id
//           symbol
//           name
//         }
//         createdAtTimestamp
//       }
//     }
//   `;

//   try {
//     const data: UniswapResponse = await request(UNISWAP_API_URL, query, { limit });
//     console.log("dlfkjdlfj", data.pairs)
//     return data.pairs;
//   } catch (error) {
//     console.error('Error fetching recently created token pairs:', error);
//     return [];
//   }
// }
