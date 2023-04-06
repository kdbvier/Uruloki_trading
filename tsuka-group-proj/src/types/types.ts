
export type ApiResponse<T> = {
    payload:Array<T> | T | undefined;
    message:string;
}

export type Order = {
    order_id: number
    user_id: number
    pair_address: string | null
    status: string | null
    token_price: bigint | null
    single_price: bigint | null
    from_price: bigint | null
    to_price: bigint | null
    budget: bigint | null
    order_type: "buy" | "sell" | null
    price_type: "single" | "range" | null
}

export type Notification = {
    notification_id: number
    user_id: number
    text: string | null
    date: Date | null
  }

export type TokenCache = {
    token_cache_id: number
    name: string | null
    chain: string | null
    address: string | null
    price: bigint | null
    hr_change: bigint | null
    volume: bigint | null
    market_cap: bigint | null
    last_updated: Date | null
  }