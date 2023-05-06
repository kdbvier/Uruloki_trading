import { request, gql } from 'graphql-request';

const UNISWAP_V2_API = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

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

    const pairResponse:any = await request(UNISWAP_V2_API, pairQuery);
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

// Example usage: Fetch pairs for the DAI token on Uniswap V2
// Replace the address below with the desired token's contract address
// getPairsByTokenAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F');
