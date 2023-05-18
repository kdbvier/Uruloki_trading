import type { ApiResponse, TokenPairInfo } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { G_QUERY_GetTokenPair } from "./g_queries";

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPairInfo>>
) {
  const { query, method } = req;
  const { pair_address } = query;

  switch (method) {
    case "GET":
      try {
        console.log("tokenPairResponse",pair_address);
        const tokenPairResponse = await G_QUERY_GetTokenPair(
          pair_address as string
        );
        if (!tokenPairResponse.data.data.ethereum.dexTrades[0]) {
          res.status(404).json({
            payload: undefined,
            message: `Pair address ${pair_address} not found`,
          });
          return;
        }
        const { token0, token1 } =
          tokenPairResponse.data.data.ethereum.dexTrades[0];
        let baseToken, pairedToken;
        if (
          [
            process.env.WETH_ADDR,
            process.env.DAI_ADDR,
            process.env.USDT_ADDR,
            process.env.USDC_ADDR,
          ].includes(String(token0.address).toLowerCase())
        ) {
          baseToken = token1;
          pairedToken = token0;
        } else {
          baseToken = token0;
          pairedToken = token1;
        }
        res.status(200).json({
          payload: {
            baseToken,
            pairedToken,
          },
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
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
