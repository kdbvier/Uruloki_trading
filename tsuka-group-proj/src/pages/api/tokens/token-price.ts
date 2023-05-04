import type { ApiResponse, TokenPriceInPair } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import axios from "axios";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
});

const prisma = new PrismaClient();

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
              "X-API-KEY": process.env.X_API_KEY,
            },
          }
        );
        const {
          token0: { address: token0Address },
          token1: { address: token1Address },
        } = tokenPairResponse.data.data.ethereum.dexTrades[0];
        let token0Addr, token1Addr;
        if (
          [
            process.env.WETH_ADDR,
            process.env.DAI_ADDR,
            process.env.USDT_ADDR,
            process.env.USDC_ADDR,
          ].includes(String(token0Address).toLowerCase())
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
              "X-API-KEY": process.env.X_API_KEY,
            },
          }
        );
        const { quotePrice } =
          quotePriceResponse.data.data.ethereum.dexTrades[0];
        console.log("quotePrice", quotePrice);
        if (
          String(token1Addr).toLowerCase() === process.env.WETH_ADDR ||
          String(token1Addr).toLowerCase() === process.env.DAI_ADDR
        ) {
          const baseCurrency = token1Addr;
          const quoteCurrency =
            token1Addr === process.env.WETH_ADDR
              ? process.env.USDC_ADDR
              : process.env.USDT_ADDR;
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
                "X-API-KEY": process.env.X_API_KEY,
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
