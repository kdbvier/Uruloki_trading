import { request, gql } from 'graphql-request';

const BITQUERY_API_ENDPOINT = 'https://graphql.bitquery.io/';
// baseCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
// quoteCurrency: {is: "0x383518188C0C6d7730D91b2c03a03C837814a899"}
// WETH = 1 USD / OHM = 10.39 USD
const fetchOHLCData = async () => {
  const query = gql`
  {
    ethereum(network: ethereum) {
      dexTrades(
        options: {limit: 10000, asc: "timeInterval.minute"}
        date: {since: "2023-01-01"}
        smartContractAddress: {is: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"}
        tradeAmountUsd: {gt: 1}
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
        "X-API-KEY": "BQYhGqHd1MptOvjXeIUPAQ1L24huNj1l"
    },
    body: JSON.stringify({
        query: query
    })
  }); 
  const data = await response.json(); 
  return data.data.ethereum.dexTrades;
};

export const getBitqueryOHLCData = async () => {
  const ohlcData = await fetchOHLCData();
  return ohlcData;
};
