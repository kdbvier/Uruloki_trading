import axios from 'axios';
import { GraphQLClient, gql } from 'graphql-request';

const uniswapClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2');

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

      // const isErc20 = await checkIfTokenIsErc20(platform);
      const isErc20 = true;
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

export async function checkIfTokenIsErc20(address: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`);
    const contractABI = JSON.parse(response.data.result);
    const erc20Functions = ['totalSupply', 'balanceOf', 'transfer', 'transferFrom', 'approve', 'allowance'];

    return erc20Functions.every((funcName) =>
      contractABI.some((func: any) => func.type === 'function' && func.name === funcName)
    );
  } catch (error) {
    console.error(`Error checking if token is ERC20: ${error}`);
    return false;
  }
}

export async function checkIfTokenIsOnUniswap(address: string): Promise<boolean> {
  try {
    const query = gql`
      query GetToken($address: String!) {
        token(id: $address) {
          id
          symbol
          name
        }
      }
    `;

    const variables = { address: address.toLowerCase() };
    const data:any = await uniswapClient.request(query, variables);

    return data?.token !== null;
  } catch (error) {
    console.error(`Error checking if token is on Uniswap: ${error}`);
    return false;
  }
}

export async function getPairsByTokenAddress(tokenAddress: string):Promise<any[]> {
  try {
    // Find pairs
    const pairQuery = gql`
      query {
        pairs(where: {token0: "${tokenAddress.toLowerCase()}"}, orderBy: reserveUSD, orderDirection: desc) {
          id
          token0 {
            symbol
            name
          }
          token1 {
            symbol
            name
          }
        }
      }
    `;

    // const pairResponse:any = await request(UNISWAP_V2_API, pairQuery);
    const pairResponse: any = await uniswapClient.request(pairQuery);
    const pairs = pairResponse.pairs;

    if (pairs.length === 0) {
      console.log(`No pairs found with token address ${tokenAddress}`);
      return [];
    }

    console.log(`Pairs for token address ${tokenAddress}:`);
    pairs.forEach((pair: any) => {
      console.log(`Pair address: ${pair.id}`);
      console.log(`${pair.token0.symbol} - ${pair.token1.symbol}`);
    });
    return pairs;
  } catch (error) {
    console.error('Error fetching pairs:', error);
    return [];
  }
}
