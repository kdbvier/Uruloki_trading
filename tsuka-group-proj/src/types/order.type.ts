
export type Orders = {
    order_id: number
    pair_address: string | null
    status: string | null
    token_price: bigint | null
    single_price: bigint | null
    from_price: bigint | null
    to_price: bigint | null
    budget: bigint | null
    order_type: "buy" | "sell" | null
    price_type: "single" | "range" | null
    user_id: number
}