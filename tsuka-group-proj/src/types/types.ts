import { orders } from "@prisma/client";

export type ApiResponse<T> = {
  payload: Array<T> | T | undefined;
  message: string;
};

export type Notification = {
  notification_id: number;
  user_id: number;
  text: string | null;
  date: Date | null;
};

export type TopGainerItem = {
  id: number
  rank: number | null
  token_cache_id: number
  token_cache: {
    name: string | null;
    price: number | null;
    chain: string | null;
    change_24hr: number | null;
} ;
};

export type TopMoverItem = {
  id: number
  rank: number | null
  token_cache_id: number
  token_cache: TokenCache & orders;
};

export type TokenCache = {
  id: number
  name: string | null
  chain: string | null
  pair_address: string
  price: number | null
  change_24hr: number | null
  volume: number | null
  market_cap: number | null
  last_updated: Date | null
}

export type MostBuyOrder = {
  id: number
  rank: number | null
  token_cache_id: number
  token_cache: {
    name: string | null;
    chain: string | null;
} ;
};

export type MostSellOrder = {
  id: number
  rank: number | null
  token_cache_id: number
  token_cache: {
    name: string | null;
    chain: string | null;
} ;
};

export type Tokens = {
  topGainers: TopGainerItem[];
  // topMovers: TopMoverItem[];
  mostBuyOrders: MostBuyOrder[];
  mostSellOrders: MostSellOrder[];
};