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
        const topGainers = await prisma.top_gainers.findMany({});
        const topMovers = await prisma.top_movers.findMany({});
        const mostBuy = await prisma.most_buy_orders.findMany({});
        const mostSell = await prisma.most_sell_orders.findMany({});
        const topGainerData = await Promise.all(
          topGainers.map(async (tg) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: tg.token_cache_id,
              },
            });
            return { ...tg, token_cache: token };
          })
        );
        const topMoverData = await Promise.all(
          topMovers.map(async (tm) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: tm.token_cache_id,
              },
            });
            return { ...tm, token_cache: token };
          })
        );
        const mostSellData = await Promise.all(
          mostSell.map(async (ms) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: ms.token_cache_id,
              },
            });
            return { ...ms, token_cache: token };
          })
        );
        const mostBuyData = await Promise.all(
          mostBuy.map(async (mb) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: mb.token_cache_id,
              },
            });
            return { ...mb, token_cache: token };
          })
        );
        const data = {
          TopGainer: topGainerData,
          TopMover: topMoverData,
          MostBuyOrders: mostBuyData,
          MostSellOrders: mostSellData,
        };

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
