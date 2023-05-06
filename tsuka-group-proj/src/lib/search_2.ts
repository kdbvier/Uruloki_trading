import axios from 'axios'

export const search2Tokens = async (name:string): Promise<any[]> => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${name}`);
    console.log("response in 2:: ", response.data);
    const tokens = response.data.tickers
      .filter((token: any) => token.target_coin_id === 'ethereum')
      .map((token: any) => ({
        name: token.coin_name,
        symbol: token.target,
        address: token.market.base
      }));
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return []
  }
};

export const search22Tokens = async (name:string): Promise<any[]> => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${name}`);
    console.log(response.data.coins)
    const tokenIds = response.data.coins.map((coin: any) => coin.id);

    // Fetch detailed information for each token, including the contract address
    const tokenDetailsPromises = tokenIds.map((id: string) =>
      axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
    );
    const tokenDetailsResponses = await Promise.all(tokenDetailsPromises);
    console.log("---------------------");
    //temp
    const usdtContractAddress = await getTokenContractAddress('ethereum', 'tether');
    console.log(usdtContractAddress); // output: "0xdac17f958d2ee523a2206206994597c13d831ec7"

    console.log(tokenDetailsResponses);

    const tokens = tokenDetailsResponses.map((res: any) => ({
      id: res.data.id,
      name: res.data.name,
      symbol: res.data.symbol,
      address: res.data.contract_address,
    }));

    return tokens;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
};

export const getTokenContractAddress = async (tokenId: string, tokenName: string) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/${tokenId}?contract_addresses=${tokenName}&vs_currencies=usd`);
    const contractAddress = Object.keys(response.data[tokenName])[0];
    console.log("contract Address", contractAddress);
    return contractAddress;
  } catch (error) {
    console.error(error);
  }
};
