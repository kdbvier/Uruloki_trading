import { ITopMover } from "@/global";
import { TopMoverItem } from "@/types";

export function TopMoversMapper(objects: TopMoverItem[]):ITopMover[] {
    return objects?.map((item) =>
      Object.assign(
        {},
        {
          id: Number(item.id),
          rank:Number( item.rank),
          token: String(item.token_cache.name),
          chain: {
            id: String(item.token_cache.chain),
            name: String(item.token_cache.chain),
            shortName: String(item.token_cache.short_name),
          },
          price: Number(Number(item.token_cache.price).toFixed(2)),
          risingPercent: Number(Number(item.token_cache.change_24hr).toFixed(2)),
          volume: Number(item.token_cache.volume),
          marketCap: Number(Number(item.token_cache.market_cap).toFixed(2)),
          orderCount: item.total_orders,
          buyOrderCount: item.buy_orders,
          sellOrderCount: item.sell_orders,
        }
      )
    );
  }