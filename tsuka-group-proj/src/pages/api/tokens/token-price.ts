import type { ApiResponse, TokenPriceInPair } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { G_QUERY_GetQuotePrice } from "./g_queries";
import {getTokenNamesFromPair} from "lib/token-pair"

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
  yesterday: Joi.boolean().optional(),
})
  .min(1)
  .max(2);

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<number>>
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
        const { pair_address, yesterday } = value;

        // const pair_address = "0xbb2b8038a1640196fbe3e38816f3e67cba72d940"; // WBTC/WETH
        // const pair_address = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"; // USTD/WETH

        const time_before = (
          yesterday
            ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            : new Date()
        ).toISOString();

        const pair_find_result = await getTokenNamesFromPair(pair_address); /* Find token pair from pair_address */

        if(pair_find_result.success !== true) {
          res.status(404).json({
            payload: undefined,
            message: `Pair address ${pair_address} not found`,
          });
          return;
        }

        const pair_base_address: string = pair_find_result.tokenPairInfo?.baseToken?.address!;
        const pair_quote_address: string = pair_find_result.tokenPairInfo?.pairedToken?.address!;

        if(!is_valid_token(pair_base_address, pair_quote_address)) {
          res.status(200).json({
            payload: 0,
            message: `Successfully found price quote for pair address ${pair_address}`,
          });          
        }

        const pair_price_result = await G_QUERY_GetQuotePrice(pair_base_address, pair_quote_address, time_before); /* get price rate of base_token / quote_token */
        if (!pair_price_result.data.data.ethereum.dexTrades?.[0]) {
          res.status(400).json({
            payload: undefined,
            message: `Transaction for ${pair_address} not found`,
          });
          return;
        }

        if(is_usdt_or_usdc(pair_find_result.tokenPairInfo?.baseToken?.address ?? "")) { //If the base token is usdt or usdc
          res.status(200).json({
            payload: pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
            message: `Successfully found price quote for pair address ${pair_address}`,
          });
        } else if (is_usdt_or_usdc(pair_find_result.tokenPairInfo?.pairedToken?.address ?? "")) { //If the paired token is usdt or usdc
          res.status(200).json({
            payload: pair_price_result.data.data.ethereum.dexTrades[0].basePrice,
            message: `Successfully found price quote for pair address ${pair_address}`,
          });
        } else { //If the base token is the "paired token", then get the price of the other token
          const base2usd_price = await get_price_base2usd(pair_quote_address, time_before);
          if(base2usd_price) { /* Case of there is transaction pair base_token / USDT or base_token/USTC */
            res.status(200).json({
              payload: base2usd_price * pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
              message: `Successfully found price quote for pair address ${pair_address}`,
            });
          } else { /* Else Use intermediate token */
            const quote2usd_price = await get_price_base2usd(pair_quote_address, time_before);
            res.status(200).json({
              payload: quote2usd_price / pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
              message: `Successfully found price quote for pair address ${pair_address}`,
            });
          }
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(err)}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function get_price_base2usd(base_address: string, time_before: string) {
  const usdt_price_result = await G_QUERY_GetQuotePrice(base_address, process.env.USDT_ADDR!, time_before);
  if(usdt_price_result.data.data.ethereum.dexTrades?.[0]) {
    return usdt_price_result.data.data.ethereum.dexTrades?.[0]?.quotePrice;
  } else {
    const usdc_price_result = await G_QUERY_GetQuotePrice(base_address, process.env.USDC_ADDR!, time_before);
    return usdc_price_result.data.data.ethereum.dexTrades?.[0]?.quotePrice;
  }
 }

function is_usdt_or_usdc(token_address: string) {
  return token_address === process.env.USDT_ADDR || token_address === process.env.USDC_ADDR;
}

function is_paired_token(token_address: string) {
  return token_address === process.env.USDT_ADDR || token_address === process.env.USDC_ADDR || token_address === process.env.WETH_ADDR || token_address === process.env.DAI_ADDR
}

function is_valid_token(base_token: string, quote_token: string) {
  return base_token.startsWith("0x") && quote_token.startsWith("0x");
}