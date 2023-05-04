export const G_QUERY_GetTokenPair = `
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
      }
      token1: quoteCurrency {
        symbol
        address
      }
    }
  }
}
`;

export const G_QUERY_GetQuotePrice = `
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
`;
