import axios from "axios";

export const G_QUERY_GetTokenPair = (pair_address: string) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
    query getPairTokenPrice($pair_address: String)
    {
      ethereum(network: ethereum) {
        dexTrades(
          smartContractAddress: {is: $pair_address}
          options: {limit: 1}
        ) {
          exchange {
            fullName
          }
          token0: baseCurrency {
            symbol
            address
            name
          }
          token1: quoteCurrency {
            symbol
            address
            name
          }
        }
      }
    }
    `,
      variables: {
        pair_address,
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};

export const G_QUERY_GetQuotePrice = (
  baseCurrency: string,
  quoteCurrency: string
) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
      query getQuotePrice($baseCurrency: String, $quoteCurrency: String){
        ethereum(network: ethereum) {
          dexTrades(
            baseCurrency: {is: $baseCurrency}
            quoteCurrency: {is: $quoteCurrency}
            options: {desc: ["block.timestamp.time", "transaction.index"], limit: 1}
          ) {
            block {
              height
              timestamp {
                time(format: "%Y-%m-%d %H:%M:%S")
              }
            }
            transaction {
              index
            }
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
          }
        }
      }
      `,
      variables: {
        baseCurrency,
        quoteCurrency,
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};
