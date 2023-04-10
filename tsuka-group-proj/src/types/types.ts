
export type ApiResponse<T> = {
  payload: Array<T> | T | undefined;
  message: string;
};

export type Order = {
  order_id: number;
  user_id: number;
  pair_address: string | null;
  status: string | null;
  token_price: number | null;
  single_price: number | null;
  from_price:  number | null;
  to_price:  number | null;
  budget:  number | null;
  order_type: "buy" | "sell" | null;
  price_type: "single" | "range" | null;
};

export type Notification = {
  notification_id: number;
  user_id: number;
  text: string | null;
  date: Date | null;
};

export type User ={
  user_id: number
  username: string
  email: string
  password?: string
}

export type LoggedInUser = {
  isLoggedIn: boolean;
  username: string;
  email: string;
};

export type TopGainer = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
}

export type TopMover = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
}
export type MostBuyOrder = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
}

export type MostSellOrder = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
}

export type Token = {
TokenCache: TokenCache;
TopGanier: TopGainer[];
TopMover: TopMover[];
MostBuyOrders: MostBuyOrder[];
MostSellOrders: MostSellOrder[];
}

export type TokenCache = {
  token_cache_id: number;
  name: string | null;
  chain: string | null;
  address: string | null;
  price: number | null;
  hr_change: number | null;
  volume: number | null;
  market_cap: number | null;
  last_updated: Date | null;
};
