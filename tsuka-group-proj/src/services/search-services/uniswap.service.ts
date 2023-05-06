import axios from 'axios';
import { GraphQLClient, gql } from 'graphql-request';

const uniswapClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2');

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
