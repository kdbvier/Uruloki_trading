import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { createClient } from "graphql-ws";

let WebSocketImpl: typeof WebSocket;

if (typeof WebSocket === "undefined") {
  WebSocketImpl = require("ws");
} else {
  WebSocketImpl = WebSocket;
}

interface TokenDetailsProps {
  sell24hrAgoTrades: Trade[];
  buy24hrAgoTrades: Trade[];
  baseAddress: string;
}

interface Trade {
  side: string;
  tradeAmount: number;
  amount: number;
  transaction: {
    index: number;
    txFrom: {
      address: string;
    };
  };
}

const determineBaseAndQuote = (
  token0Address: string,
  token1Address: string
): { baseAddress: string; quoteAddress: string } => {
  const stablecoinAddresses = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
  ];

  let baseAddress, quoteAddress;
  if (stablecoinAddresses.includes(token0Address)) {
    baseAddress = token0Address;
    quoteAddress = token1Address;
  } else if (stablecoinAddresses.includes(token1Address)) {
    baseAddress = token1Address;
    quoteAddress = token0Address;
  } else {
    if (token0Address.toLowerCase() < token1Address.toLowerCase()) {
      baseAddress = token0Address;
      quoteAddress = token1Address;
    } else {
      baseAddress = token1Address;
      quoteAddress = token0Address;
    }
  }
  return { baseAddress, quoteAddress };
};

const getQuery = (tradeSide: string): { query: string } => {
  return {
    query: `
    subscription {
      EVM(network: eth) {
        DEXTrades(
          where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x514910771AF9Ca656af840dff83E8264EcF986CA"}}}}}
        ) {
          Trade {
            ${tradeSide} {
              Currency {
                Symbol
                SmartContract
              }
              Price
              Amount
            }
          }
        }
      }
    }
    `,
  };
};

const client = createClient({
  url: "wss://streaming.bitquery.io/graphql",
  webSocketImpl: WebSocketImpl,
  connectionParams: () => ({
    headers: {
      "X-API-KEY": process.env.BITQUERY_API_KEY,
    },
  }),
});

const TokenDetails: React.FC<TokenDetailsProps> = ({
  sell24hrAgoTrades,
  buy24hrAgoTrades,
  baseAddress,
}) => {
  const [buyTrades, setBuyTrades] = useState(sell24hrAgoTrades);
  const [sellTrades, setSellTrades] = useState(buy24hrAgoTrades);

  useEffect(() => {
    const onNext = (data: any) => {
      const updatedTrades = data.data.EVM.DEXTrades.map((el: any) => {
        const obj = el.Trade;
        const side = Object.keys(el.Trade)[0];
        return {
          side,
          tradeAmount: obj[side].Amount,
          price: obj[side].Price,
          transaction: {
            txFrom: {
              address: obj[side].Currency.SmartContract,
            },
          },
        };
      });

      setSellTrades((prevTrades) => [
        ...prevTrades,
        ...updatedTrades.filter((el: any) => el.side.includes("Sell")),
      ]);
    };

    let unsubscribe = () => {
      /* complete the subscription */
    };

    (async () => {
      await new Promise<void>((resolve, reject) => {
        unsubscribe = client.subscribe(getQuery("Sell"), {
          next: onNext,
          error: (err) => {
            console.log("Subscription error:", err);
            reject(err);
          },
          complete: () => {
            console.log("Subscription complete");
            resolve();
          },
        });
      });
    })();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onNext = (data: any) => {
      const updatedTrades = data.data.EVM.DEXTrades.map((el: any) => {
        const obj = el.Trade;
        const side = Object.keys(el.Trade)[0];
        return {
          side,
          tradeAmount: obj[side].Amount,
          transaction: {
            txFrom: {
              address: obj[side].Currency.SmartContract,
            },
          },
        };
      });
      setBuyTrades((prevTrades) => [
        ...prevTrades,
        ...updatedTrades.filter((el: any) => el.side.includes("Buy")),
      ]);
    };

    let unsubscribe = () => {
      /* complete the subscription */
    };

    (async () => {
      await new Promise<void>((resolve, reject) => {
        unsubscribe = client.subscribe(getQuery("Buy"), {
          next: onNext,
          error: (err) => {
            console.log("Subscription error:", err);
            reject(err);
          },
          complete: () => {
            console.log("Subscription complete");
            resolve();
          },
        });
      });
    })();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ color: "#fff" }}>
      <h1>Sell Trades</h1>
      <table style={{ margin: "1rem 0" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Buyer Address</th>
          </tr>
        </thead>
        <tbody>
          {sellTrades?.map((trade) => (
            <tr key={trade.transaction.index}>
              <td style={{ padding: "1rem" }}>{trade.side}</td>
              <td style={{ padding: "1rem" }}>{trade.amount}</td>
              <td style={{ padding: "1rem" }}>{trade.tradeAmount}</td>
              <td style={{ padding: "1rem" }}>
                {trade.transaction.txFrom.address}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Buy Trades</h1>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Price</th>
            {/* <th>Amount Bitcoin</th> */}
            <th>Buyer Address</th>
          </tr>
        </thead>
        <tbody>
          {buyTrades?.map((trade) => (
            <tr key={trade.transaction.index}>
              <td style={{ padding: "1rem" }}>{trade.side}</td>
              <td style={{ padding: "1rem" }}>{trade.tradeAmount}</td>
              <td style={{ padding: "1rem" }}>
                {trade.transaction.txFrom.address}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenDetails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const { data } = await axios.post(
    "https://graphql.bitquery.io/",
    {
      query: `{
        ethereum {
          arguments(smartContractAddress: {is: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"}, smartContractEvent: {is: "PairCreated"}, options: { limit: 3 }) {
            block {
              height
            }
            argument {
              name
            }
            reference {
              address
            }
          }
        }
      }`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQYYvTYy2UDpOqezZCl0NatKN7HKmtgc",
      },
    }
  );

  const ethereum = data?.data?.ethereum;

  const token0 = ethereum.arguments?.find(
    (el: any) => el.argument.name === "token0"
  );
  const token1 = ethereum.arguments?.find(
    (el: any) => el.argument.name === "token1"
  );

  const { baseAddress, quoteAddress } = determineBaseAndQuote(
    token0?.reference?.address,
    token1?.reference?.address
  );

  let sell24hrAgoTrades = [];
  let buy24hrAgoTrades = [];

  try {
    const { data } = await axios.post(
      "https://graphql.bitquery.io/",
      {
        query: `{
          ethereum(network: ethereum) {
            dexTrades(
              baseCurrency: {is: "${baseAddress}"}
              quoteCurrency: {is: "${quoteAddress}"}
              options: {desc: ["block.timestamp.time", "transaction.index"], limit: 1}
            ) {
              block {
                height
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
              }
              tradeAmount
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
          "X-API-KEY": "BQYYvTYy2UDpOqezZCl0NatKN7HKmtgc",
        },
      }
    );

    const dexTrades = data.data.ethereum.dexTrades.map((el: any) => {
      const amount = el.side === "SELL" ? el.sellAmount : el.buyAmount;
      return {
        tradeAmount: el.tradeAmount,
        side: el.side,
        amount,
        transaction: el.transaction,
      };
    });

    if (dexTrades && dexTrades.length) {
      sell24hrAgoTrades = dexTrades?.filter((el: any) => el.side === "SELL");
      buy24hrAgoTrades = dexTrades?.filter((el: any) => el.side === "BUY");
    }
  } catch (error) {
    console.log("err", error);
  }

  return {
    props: { sell24hrAgoTrades, buy24hrAgoTrades, baseAddress },
  };
};
