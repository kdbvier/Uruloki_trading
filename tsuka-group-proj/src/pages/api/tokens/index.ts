import type { ApiResponse, Token } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function TokenCacheHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Token>>
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const tokens = await prisma.token_cache.findMany();
        const data = await Promise.all(
          tokens.map(async (token) => {
            const topGainer = await prisma.top_gainers.findFirst({
              where: {
                token_cache_id: token.token_cache_id,
              },
            });
            const topMover = await prisma.top_movers.findFirst({
              where: {
                token_cache_id: token.token_cache_id,
              },
            });
            const mostBuy = await prisma.most_buy_orders.findFirst({
              where: {
                token_cache_id: token.token_cache_id,
              },
            });
            const mostSell = await prisma.most_sell_orders.findFirst({
              where: {
                token_cache_id: token.token_cache_id,
              },
            });
            return {
              TopGainer: { ...topGainer, token_cache: token },
              TopMover: { ...topMover, token_cache: token },
              MostBuyOrders: { ...mostBuy, token_cache: token },
              MostSellOrders: { ...mostSell, token_cache: token },
            };
          })
        );
        res
          .status(200)
          .json({ payload: data, message: `Successfully found Tokens` });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
