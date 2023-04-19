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
  token_cache_id: number;
  rank: number | null;
  token_cache: {
    name: string | null;
    price: number | null;
    chain: string | null;
    change_24hr: number | null;
} | null;
};

export type TopMoverItem = {
  token_cache_id: number;
  rank: number | null;
  token_cache: {
    name: string | null;
    price: number | null;
    chain: string | null;
    change_24hr: number | null;
    volume: number | null;
    market_cap: number | null;
    total_orders: number | null;
    buy_split: number | null;
    sell_split: number | null;
} | null;
};

export type MostBuyOrder = {
  token_cache_id: number;
  rank: number | null;
  token_cache: {
    name: string | null;
    chain: string | null;
    buy_orders: number | null;
} | null;
};

export type MostSellOrder = {
  token_cache_id: number;
  rank: number | null;
  token_cache: {
    name: string | null;
    chain: string | null;
    sell_orders: number | null;
} | null;
};

export type Tokens = {
  topGainers: TopGainerItem[];
  topMovers: TopMoverItem[];
  mostBuyOrders: MostBuyOrder[];
  mostSellOrders: MostSellOrder[];
};