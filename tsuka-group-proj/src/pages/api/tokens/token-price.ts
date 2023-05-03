import type { ApiResponse, TokenPriceInPair } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import axios from "axios";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
});

const prisma = new PrismaClient();
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDC_ADDR = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDR = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const X_API_KEY = "BQYfyvw31f5AN6nWgSkVNmVwba7AI4f1";

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPriceInPair>>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const { pair_address } = value;
        const tokenCache = await prisma.token_cache.findFirst({
          where: {
            pair_address,
          },
        });
        if (!tokenCache) {
          res.status(404).json({
            payload: undefined,
            message: `Token pair ${pair_address} not found!`,
          });
          return;
        }
        const tokenPairResponse = await axios.post(
          "https://graphql.bitquery.io",
          {
            query: `
          {
            ethereum(network: ethereum) {
              dexTrades(
                smartContractAddress: {is: "${pair_address}"}
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
          `,
          },
          {
            headers: {
              "X-API-KEY": X_API_KEY,
            },
          }
        );
        const {
          token0: { address: token0Address },
          token1: { address: token1Address },
        } = tokenPairResponse.data.data.ethereum.dexTrades[0];
        let token0Addr, token1Addr;
        if (
          [WETH_ADDR, DAI_ADDR, USDT_ADDR, USDC_ADDR].includes(
            String(token0Address).toLowerCase()
          )
        ) {
          token0Addr = token1Address;
          token1Addr = token0Address;
        } else {
          token0Addr = token0Address;
          token1Addr = token1Address;
        }

        const quotePriceResponse = await axios.post(
          "https://graphql.bitquery.io",
          {
            query: `
            {
              ethereum(network: ethereum) {
                dexTrades(
                  baseCurrency: {is: "${token0Addr}"}
                  quoteCurrency: {is: "${token1Addr}"}
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
          },
          {
            headers: {
              "X-API-KEY": X_API_KEY,
            },
          }
        );
        const { quotePrice } =
          quotePriceResponse.data.data.ethereum.dexTrades[0];
        if (
          String(token1Addr).toLowerCase() === WETH_ADDR ||
          String(token1Addr).toLowerCase() === DAI_ADDR
        ) {
          const baseCurrency = token1Addr;
          const quoteCurrency =
            token1Addr === WETH_ADDR ? USDC_ADDR : USDT_ADDR;
          const baseQuotePriceResponse = await axios.post(
            "https://graphql.bitquery.io",
            {
              query: `
              {
                ethereum(network: ethereum) {
                  dexTrades(
                    baseCurrency: {is: "${baseCurrency}"}
                    quoteCurrency: {is: "${quoteCurrency}"}
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
            },
            {
              headers: {
                "X-API-KEY": X_API_KEY,
              },
            }
          );
          const { quotePrice: baseQuotePrice } =
            baseQuotePriceResponse.data.data.ethereum.dexTrades[0];
          console.log("baseQuotePrice", baseQuotePrice);
          res.status(200).json({
            payload: { quote_price: quotePrice * baseQuotePrice },
            message: `Successfully found price quote for pair address ${pair_address}`,
          });
          return;
        }
        res.status(200).json({
          payload: { quote_price: quotePrice },
          message: `Successfully found price quote for pair address ${pair_address}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(
            err
          )}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
