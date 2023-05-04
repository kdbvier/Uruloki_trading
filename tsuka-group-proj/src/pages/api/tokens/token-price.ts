import type { ApiResponse, TokenPriceInPair } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import axios from "axios";
import { G_QUERY_GetQuotePrice, G_QUERY_GetTokenPair } from "./g_queries";

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
        const tokenPairResponse = await axios.post(
          "https://graphql.bitquery.io",
          {
            query: G_QUERY_GetTokenPair,
            variables: {
              pair_address,
            },
          },
          {
            headers: {
              "X-API-KEY": process.env.X_API_KEY,
            },
          }
        );
        if (!tokenPairResponse.data.data.ethereum.dexTrades[0]) {
          res.status(404).json({
            payload: undefined,
            message: `Pair address ${pair_address} not found`,
          });
          return;
        }
        const {
          token0: { address: token0Address },
          token1: { address: token1Address },
        } = tokenPairResponse.data.data.ethereum.dexTrades[0];
        console.log(token0Address, token1Address);
        let tokenAddress, pairedTokenAddress;
        if (
          [
            process.env.WETH_ADDR,
            process.env.DAI_ADDR,
            process.env.USDT_ADDR,
            process.env.USDC_ADDR,
          ].includes(String(token0Address).toLowerCase())
        ) {
          tokenAddress = token1Address;
          pairedTokenAddress = token0Address;
        } else {
          tokenAddress = token0Address;
          pairedTokenAddress = token1Address;
        }

        const quotePriceResponse = await axios.post(
          "https://graphql.bitquery.io",
          {
            query: G_QUERY_GetQuotePrice,
            variables: {
              baseCurrency: tokenAddress,
              quoteCurrency: pairedTokenAddress,
            },
          },
          {
            headers: {
              "X-API-KEY": process.env.X_API_KEY,
            },
          }
        );
        const { quotePrice } =
          quotePriceResponse.data.data.ethereum.dexTrades[0];
        if (
          String(pairedTokenAddress).toLowerCase() === process.env.WETH_ADDR ||
          String(pairedTokenAddress).toLowerCase() === process.env.DAI_ADDR
        ) {
          const baseCurrency = pairedTokenAddress;
          const quoteCurrency =
            pairedTokenAddress === process.env.WETH_ADDR
              ? process.env.USDC_ADDR
              : process.env.USDT_ADDR;
          const baseQuotePriceResponse = await axios.post(
            "https://graphql.bitquery.io",
            {
              query: G_QUERY_GetQuotePrice,
              variables: {
                baseCurrency,
                quoteCurrency,
              },
            },
            {
              headers: {
                "X-API-KEY": process.env.X_API_KEY,
              },
            }
          );
          const { quotePrice: baseQuotePrice } =
            baseQuotePriceResponse.data.data.ethereum.dexTrades[0];
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
