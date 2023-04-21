import { orders, token_cache, top_movers } from "@prisma/client";

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
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    name: string | null;
    price: number | null;
    chain: string | null;
    change_24hr: number | null;
  };
};

export type TopMoverItem = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    id: number;
    name: string | null;
    chain: string | null;
    pair_address: string;
    price: number | null;
    change_24hr: number | null;
    volume: number | null;
    market_cap: number | null;
  };
  
}& OrderDetails;;

export type MostBuyOrder = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    name: string | null;
    chain: string | null;
  };
  
}& OrderDetails;;

export type MostSellOrder = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    name: string | null;
    chain: string | null;
  };
} & OrderDetails;

type OrderDetails = {
  buy_orders: number;
  sell_orders: number;
  total_orders: number;
}

export type Tokens = {
  topGainers: TopGainerItem[];
  topMovers: TopMoverItem[];
  mostBuyOrders: MostBuyOrder[];
  mostSellOrders: MostSellOrder[];
};
