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



export type TopGainer = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type TopMover = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type MostBuyOrder = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type MostSellOrder = {
  id: number;
  rank: string | null;
  address: string | null;
  token_cache_id: number;
  token_cache: TokenCache | null;
}

export type Token = {
  TopGainer: TopGainer[];
  TopMover: TopMover[];
  MostBuyOrders: MostBuyOrder[];
  MostSellOrders: MostSellOrder[];
};
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
