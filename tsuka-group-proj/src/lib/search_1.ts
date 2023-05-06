import token from '@/store/apps/token';
import axios from 'axios';
import { getPairsByTokenAddress } from './search_3';

// export async function searchTokensByName(name: string): Promise<any[]> {
//   try {
//     const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${name}`);
//     console.log("response");
//     console.log(response.data.coins);
//     const tokens = response.data.coins.map((coin: any) => ({
//       id: coin.item.id,
//       name: coin.item.name,
//       symbol: coin.item.symbol,
//       image: coin.item.thumb,
//       platform: coin.item.platform // Add this line to include platform information
//     }));

//     return tokens;
//   } catch (error) {
//     console.error(`Error searching tokens by name: ${error}`);
//     return [];
//   }
// }


export async function searchTokensByName(name: string): Promise<any[]> {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true');
    const tokens = response.data.filter((coin: any) => coin.name.toLowerCase().includes(name.toLowerCase()));
    console.log("Look at this::  ",  tokens);

    return tokens.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      platform: coin.platforms.ethereum,
    }))
    .filter((token:any)=>token.platform);
  } catch (error) {
    console.error(`Error searching tokens by name: ${error}`);
    return [];
  }
}

export async function searchERCTokens(search: string): Promise<any[]>{
  // searchTokensByName(search).then(tokens => {
  //   const erc20Tokens = tokens.filter(token => token.platform && token.platform.id === 'ethereum');
  //   console.log(erc20Tokens);
  //   return erc20Tokens;
  // });

  const tokens = await searchTokensByName(search);
  console.log("tokens");
  console.log(tokens);
  // const erc20Tokens = tokens.filter(token => token.platforms.ethereum);
  // console.log("erc20 tokens");
  // console.log(erc20Tokens);
  return tokens;
}
