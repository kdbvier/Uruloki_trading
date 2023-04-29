export type Order = {
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
    baseTokenShortName: string | null;
    pairTokenShortName: string | null;
    baseTokenLongName: string | null;
    pairTokenLongName: string | null;
  };

export type PostOrder = {
    user_id: number;
    pair_address: string ;
    status: string;
    single_price?: number;
    from_price?: number | null;
    to_price?: number | null;
    budget: number;
    order_type: "buy" | "sell" ;
    price_type: "single" | "range" ;
    baseTokenShortName?: string | null;
    pairTokenShortName?: string | null;
    baseTokenLongName?: string | null;
    pairTokenLongName?: string | null;
  }

  export type PatchOrder = {
    pair_address?: string ;
    status?: string ;
    single_price?: number;
    from_price?: number | null;
    to_price?: number | null;
    budget?: number;
    order_type?: "buy" | "sell" ;
    price_type?: "single" | "range" ;
    baseTokenShortName?: string | null;
    pairTokenShortName?: string | null;
    baseTokenLongName?: string | null;
    pairTokenLongName?: string | null;
  }