import type { ApiResponse, Tokens } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function TokenCacheHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Tokens>>
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const topGainers = await prisma.top_gainers.findMany({
          select: {
            token_cache_id: true,
            rank: true,
          },
        });
        const topMovers = await prisma.top_movers.findMany({
          select: {
            token_cache_id: true,
            rank: true,
          },
        });
        const mostBuy = await prisma.most_buy_orders.findMany({
          select: {
            token_cache_id: true,
            rank: true,
          },
        });
        const mostSell = await prisma.most_sell_orders.findMany({
          select: {
            token_cache_id: true,
            rank: true,
          },
        });
        const topGainerData = await Promise.all(
          topGainers.map(async (tg: any) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: tg.token_cache_id,
              },
              select: {
                name: true,
                price: true,
                chain: true,
                change_24hr: true,
              },
            });
            return { ...tg, token_cache: token };
          })
        );
        const topMoverData = await Promise.all(
          topMovers.map(async (tm: any) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: tm.token_cache_id,
              },
              select: {
                name: true,
                chain: true,
                price: true,
                change_24hr: true,
                market_cap: true,
                volume: true,
                total_orders: true,
              },
            });
            return { ...tm, token_cache: token };
          })
        );
        const mostSellData = await Promise.all(
          mostSell.map(async (ms: any) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: ms.token_cache_id,
              },
              select: {
                name: true,
                sell_orders: true,
                chain: true,
              },
            });
            return { ...ms, token_cache: token };
          })
        );
        const mostBuyData = await Promise.all(
          mostBuy.map(async (mb: any) => {
            const token = await prisma.token_cache.findUnique({
              where: {
                token_cache_id: mb.token_cache_id,
              },
              select: {
                name: true,
                buy_orders: true,
                chain: true,
              },
            });
            return { ...mb, token_cache: token };
          })
        );
        const data = {
          topGainers: topGainerData,
          topMovers: topMoverData,
          mostBuyOrders: mostBuyData,
          mostSellOrders: mostSellData,
        };

        res.status(200);
        //.json({ payload: data, message: `Successfully found Tokens` });
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
