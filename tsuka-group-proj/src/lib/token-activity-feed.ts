import axios from "axios";

export type HistoricalDexTrades = {
    sellTrades: Array<any>;
    buyTrades: Array<any>;
}

export type HistoricalDexTradesResult = {
    success: boolean;
    historicalDexTrades?: HistoricalDexTrades;
}

export async function getHistoricalDexTrades(baseAddress: string, quoteAddress: string): Promise<HistoricalDexTradesResult> {
    try {
        const { data } = await axios.post(
          "https://graphql.bitquery.io/",
          {
            query: `{
              ethereum(network: ethereum) {
                dexTrades(
                  baseCurrency: {is: "${baseAddress}"}
                  quoteCurrency: {is: "${quoteAddress}"}
                  options: {desc: ["block.timestamp.time", "transaction.index"], limit: 10}
                ) {
                  block {
                    height
                    timestamp {
                      time(format: "%Y-%m-%d %H:%M:%S")
                    }
                  }
                  tradeAmount(in: BTC)
                  side
                  sellAmount(in: USD)
                  buyAmount(in: USD)
                  transaction {
                    index
                    txFrom {
                      address
                    }
                  }
                }
              }
          }`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": "BQYedcj8q0acU4h8q0CmF2rfIVZp9VOe",
            },
          }
        );
    
        const dexTrades = data?.data?.ethereum?.dexTrades.map((el: any) => {
          const amount = el.side === "SELL" ? el.sellAmount : el.buyAmount;
          return {
            tradeAmount: el.tradeAmount,
            side: el.side,
            price: amount,
            transaction: el.transaction,
          };
        });
    
        if (dexTrades && dexTrades.length) {
          let sell24hrAgoTrades = dexTrades?.filter((el: any) => el.side === "SELL");
          let buy24hrAgoTrades = dexTrades?.filter((el: any) => el.side === "BUY");

          return {
            success: true,
            historicalDexTrades: {
                sellTrades: sell24hrAgoTrades,
                buyTrades: buy24hrAgoTrades
            }
          }
        } else {
            return {
                success: false
            }
        }
      } catch (error) {
        console.log("Unable to fetch historical dex trades for activity feed")
        return {
            success: false
        }
      }
}