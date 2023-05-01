export type Order = {
  baseTokenShortName: string;
  pairTokenShortName: string;
  baseTokenLongName: string;
  pairTokenLongName: string;
  order_id: number;
  user_id: number;
  pair_address: string | null;
  status: string | null;
  single_price: number | null;
  from_price: number | null;
  to_price: number | null;
  budget: number | null;
  order_type: "buy" | "sell" | null;
  price_type: "single" | "range" | null;
};

export type PostOrder = {
  user_id: number;
  pair_address: string;
  status: string;
  single_price?: number;
  from_price?: number | null;
  to_price?: number | null;
  budget: number;
  order_type: "buy" | "sell";
  price_type: "single" | "range";
  baseTokenShortName: string;
  baseTokenLongName: string;
  pairTokenShortName: string;
  pairTokenLongName: string;
};

export type PatchOrder = {
  pair_address?: string;
  status?: string;
  single_price?: number;
  from_price?: number | null;
  to_price?: number | null;
  budget?: number;
  order_type?: "buy" | "sell";
  price_type?: "single" | "range";
};

export type OrdersBook = {
  price: number;
  size: number;
};

export type OrdersBookType = {
  [price: string]: OrdersBook;
};