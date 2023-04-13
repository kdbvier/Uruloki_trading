export type Order = {
    order_id: number;
    user_id: number;
    pair_address: string | null;
    status: string | null;
    token_price: number | null;
    single_price: number | null;
    from_price: number | null;
    to_price: number | null;
    budget: number | null;
    order_type: "buy" | "sell" | null;
    price_type: "single" | "range" | null;
  };

export type PostOrder = {
    user_id: number;
    pair_address: string ;
    status: string ;
    token_price: number ;
    single_price?: number;
    from_price?: number | null;
    to_price?: number | null;
    budget: number;
    order_type: "buy" | "sell" ;
    price_type: "single" | "range" ;
  }

  export type PatchOrder = {
    pair_address?: string ;
    status?: string ;
    token_price?: number ;
    single_price?: number;
    from_price?: number | null;
    to_price?: number | null;
    budget?: number;
    order_type?: "buy" | "sell" ;
    price_type?: "single" | "range" ;
  }