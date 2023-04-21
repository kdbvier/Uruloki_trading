import type { ApiResponse, Tokens } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function TokenCacheHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const topGainers = await prisma.top_gainers.findMany({
          include: {
            token_cache: {
              select: {
                name: true,
                price: true,
                chain: true,
                change_24hr: true,
              },
            },
          },
        });
        const topMovers = await prisma.top_movers.findMany({
          include: {
            token_cache: {
              include:{
                order:true
              }
            },
          },
        });
        const topMovsers = await prisma.top_movers.aggregate({
         where:{
          token_cache:{
            order:{
              every:{
                order_type:'sell'
              }
            }
          }
         }
        });
        const topMovserss = await prisma.top_movers.aggregate({
          where:{
           token_cache:{
             order:{
               every:{
                 order_type:'buy'
               }
             }
           }
          }
         });
        let sellOrders=0
        let buyOrders=0
        let totalOrders = 0
        const topMoversData =topMovers.map((tm)=>{
          tm.token_cache.order.map((order)=>{
            if(order.order_type==='sell'){
              sellOrders++;
            }
            if(order.order_type==='buy'){
              buyOrders++;
            }
            totalOrders++;
          })

        })
        const mostBuy = await prisma.most_buy_orders.findMany({
        include:{
          token_cache:{
            select: {
              name: true,
              chain: true,
            },
          }
        }
        });
        const mostSell = await prisma.most_sell_orders.findMany({
          include:{
            token_cache:{
              select: {
                name: true,
                chain: true,
              },
            }
          }
        });
        const data = {
          topGainers: topGainers,
          topMovers: topMovers,
          mostBuyOrders: mostBuy,
          mostSellOrders: mostSell,
        };

        res.status(200).json({ payload: data, message: `Successfully found Tokens` });
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
