import { gql } from 'graphql-request';

const BITQUERY_API_ENDPOINT = 'https://graphql.bitquery.io/';
const BITQUERY_API_KEY = process.env.NEXT_PUBLIC_BITQUERY_API_KEY as string;
const baseCurrencyAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const quoteCurrencyAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as string; 
const from = "2023-05-04";
const interval = 40;
// WETH = 1 WETH / USDC 
const fetchOHLCData = async () => {
  const query = gql`
  {
    ethereum(network: ethereum) {
      dexTrades(
        options: {limit: 100, asc: "timeInterval.minute"}
        date: {since: "${from}"}
        baseCurrency: {is: "${baseCurrencyAddress}"}
        quoteCurrency: {is: "${quoteCurrencyAddress}"}
        tradeAmountUsd: {gt: 20}
      ) {
        timeInterval {
          minute(count: ${interval})
        }
        baseCurrency {
          symbol
          address
        }
        baseAmount
        quoteCurrency {
          symbol
          address
        }
        tradeAmount(in: USD)
        quoteAmount
        trades: count
        quotePrice
        high: quotePrice(calculate: maximum)
        low: quotePrice(calculate: minimum)
        open: minimum(of: block, get: quote_price)
        close: maximum(of: block, get: quote_price)
      }
    }
  }
  `;
  const response = await fetch(BITQUERY_API_ENDPOINT, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": BITQUERY_API_KEY
    },
    body: JSON.stringify({
        query: query
    })
  }); 
  const data = await response.json(); 
  return data.data.ethereum.dexTrades;
};
// fetch the historical data
export const getBitqueryOHLCData = async () => {
  const ohlcData = await fetchOHLCData();
  return ohlcData;
};
