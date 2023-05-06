import { gql } from 'graphql-request';

const BITQUERY_API_ENDPOINT = 'https://graphql.bitquery.io/';
const BITQUERY_API_KEY = "BQYhGqHd1MptOvjXeIUPAQ1L24huNj1l";
// baseCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
// quoteCurrency: {is: "0x383518188C0C6d7730D91b2c03a03C837814a899"}
// WETH = 1 WETH / USDC = 10.39 USD
const fetchOHLCData = async () => {
  const query = gql`
  {
    ethereum(network: ethereum) {
      dexTrades(
        options: {limit: 1000, asc: "timeInterval.minute"}
        date: {since: "2023-04-10"}
        baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
        quoteCurrency: {is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}
        tradeAmountUsd: {gt: 10}
      ) {
        timeInterval {
          minute(count: 40)
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
