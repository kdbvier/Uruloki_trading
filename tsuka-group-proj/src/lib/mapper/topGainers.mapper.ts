import { ITopGainer } from "@/global";
import { TopGainerItem } from "@/types";

export function TopGainersMapper(objects: TopGainerItem[]): ITopGainer[] {
  return objects?.map((item) =>
    Object.assign(
      {},
      {
        rank: Number(item.rank),
        token: {
          id: String(item.token_cache.name),
          name: String(item.token_cache.name),
          shortName: String(item.token_cache.short_name),
        },
        price: Number(Number(item.token_cache.price).toFixed(2)),
        risingPercent: Number(Number(item.token_cache.change_24hr).toFixed(2)),
      }
    ) 
  );
}
