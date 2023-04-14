
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
  rank: number | null
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type TopMoverItem = {
  id: number;
  rank: number | null
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type MostBuyOrder = {
  id: number;
  rank: number | null
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type MostSellOrder = {
  id: number;
  rank: number | null
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type Tokens = {
  topGainers: TopGainerItem[];
  topMovers: TopMoverItem[];
  mostBuyOrders: MostBuyOrder[];
  mostSellOrders: MostSellOrder[];
};
export type TokenCache = {
  token_cache_id: number
  name: string | null
  chain: string | null
  address: string | null
  price: number | null
  change_24hr: number | null
  volume: number | null
  market_cap: number | null
  total_orders: number | null
  buy_orders: number | null
  sell_orders: number | null
  last_updated: Date | null
}