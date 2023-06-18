import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateTopGainers } from "@/lib/server/tokens/update/topGainers";
import { Etherscan } from "@/lib/etherscan/etherscan";
import { updateTokenCacheMarketCap } from "@/lib/server/tokens/update/marketCap";
import { purgeTokenCache } from "@/lib/server/tokens/update/purgeTokenCache";
import { G_QUERY_GetTopGainersAndMovers } from "../tokens/g_queries";
import { updateTopMovers } from "@/lib/server/tokens/update/topMovers";

const prisma = new PrismaClient();

type OrderCount = {
    pair_address: string,
    buyOrders: number,
    sellOrders: number,
    token_cache_id: number | undefined
}

export default async function NotificationByUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const MINIMUM_TX_COUNT = 300

        var now = Date.now()
        var yesterday = now - (3600 * 24 * 1000)

        /*
        console.log("Getting token data from bitquery...")
        const result = await G_QUERY_GetTopGainersAndMovers("ethereum", new Date(yesterday), new Date())
            
        //Handle any errors with the query
        if(!result.success || !result.topGainers) {
            return {
                success: false,
                message: "Unable to fetch top movers"
            }
        }

        const bitqueryData = result.topGainers
        
        //Update data for top gainers by updating top_gainers and adding tokens to token_cache
        console.log("Getting top gainers...")
        const updateTopGainersResult = await updateTopGainers(MINIMUM_TX_COUNT, bitqueryData)
        
        console.log("Getting top movers...")
        const updateTopMoversResult = await updateTopMovers(MINIMUM_TX_COUNT, bitqueryData)
        */

        console.log("Getting order data...")        
        const allOrders = await prisma.orders.findMany({
            include: {
                token_cache: true
            }
        })
        let orderCount: Array<OrderCount> = []
        
        allOrders.map(order => {
            let count = orderCount.find(a => a.pair_address == order.pair_address)

            if(typeof(count) != "undefined") {
                if(order.order_type == "buy") {
                    count.buyOrders += 1
                } else {
                    count.sellOrders += 1
                }
            } else {
                orderCount.push({
                    pair_address: order.pair_address,
                    buyOrders: order.order_type == "buy" ? 1 : 0,
                    sellOrders: order.order_type == "sell" ? 1 : 0,
                    token_cache_id: order.token_cache?.id
                })
            }
        })

        console.log("Getting tokens with most buy orders...")
        const tokensWithMostBuyOrders = orderCount.sort((a, b) => b.buyOrders - a.buyOrders).slice(0, 100)

        console.log("Getting tokens with most sell orders...")
        const tokensWithMostSellOrders = orderCount.sort((a, b) => b.sellOrders - a.sellOrders).slice(0, 100)

        console.log("Most buy orders:")
        console.log(tokensWithMostBuyOrders)

        //Clear most_buy_orders and most_sell_orders tables and add new data
        const buyOrdersInsertData = tokensWithMostBuyOrders
                .map((item, index) => {
                    return {
                        token_cache_id: item.token_cache_id ?? 0,
                        rank: index + 1
                    }
                }
                ).filter(a => a.token_cache_id != 0)
                .map((item, index) => {
                    item.rank = index + 1
                    return item
                })

        const sellOrdersInsertData = tokensWithMostSellOrders
                .map((item, index) => {
                    return {
                        token_cache_id: item.token_cache_id ?? 0,
                        rank: index + 1
                    }
                }
                ).filter(a => a.token_cache_id != 0)
                .map((item, index) => {
                    item.rank = index + 1
                    return item
                })

        await prisma.most_buy_orders.deleteMany({})
        await prisma.most_buy_orders.createMany({
            data: buyOrdersInsertData
        })

        console.log("Most sell orders:")
        console.log(tokensWithMostSellOrders)

        //Clear most_sell_orders table and add new data
        await prisma.most_sell_orders.deleteMany({})
        await prisma.most_sell_orders.createMany({
            data: sellOrdersInsertData
        })
        
        console.log("Updating market cap...")
        //const updateMarketCapResult = await updateTokenCacheMarketCap()

        console.log("Purging token cache...")
        //await purgeTokenCache()

        res.status(200).json({ message: `Successfully updated data` });
      } catch (err) {
        res.status(500).json({ message: `Something went wrong! Please read the error message '${err}'` });
      }
      break;
    default:
      res.setHeader("Allow", "POST");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
