import axios from "axios";
import { useEffect, useState } from "react";
// import io from "socket.io-client";

function determineBaseAndQuote(token0Address, token1Address) {
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
    // Both tokens are not stablecoins; you can use other criteria to determine base and quote.
    // For example, you could use alphabetical order based on their addresses.
    if (token0Address.toLowerCase() < token1Address.toLowerCase()) {
      baseAddress = token0Address;
      quoteAddress = token1Address;
    } else {
      baseAddress = token1Address;
      quoteAddress = token0Address;
    }
  }
  return { baseAddress, quoteAddress };
}

export default function TokenDetails({ trades, baseAddress, quoteAddress }) {
  const [tradeFeed, setTradeFeed] = useState(trades);

  return (
    <div style={{ color: "#fff" }}>
      <h1>Token Details</h1>
      <table style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Price</th>
            {/* <th>Amount Bitcoin</th> */}
            <th>Buyer Address</th>
          </tr>
        </thead>
        <tbody>
          {tradeFeed?.map((trade) => (
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
}

// Fetch the initial trades data from Bitquery's API
export async function getServerSideProps(context) {
  const { id } = context.query;

  const {
    data: {
      data: { ethereum },
    },
  } = await axios.post(
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

  const token0 = ethereum.arguments?.find(
    (el) => el.argument.name === "token0"
  );
  const token1 = ethereum.arguments?.find(
    (el) => el.argument.name === "token1"
  );

  const { baseAddress, quoteAddress } = determineBaseAndQuote(
    token0?.reference?.address,
    token1?.reference?.address
  );

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
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
            tradeAmount(in: USD)
            quoteAmount
            side
            sellAmount(in: USD)
            buyAmount(in: USD)
            transaction {
              index
              txFrom {
                address
              }
            }
            baseAmount(in: USD)
            count
            maker {
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

  return {
    props: { trades: data.data.ethereum.dexTrades, baseAddress, quoteAddress },
  };
}
