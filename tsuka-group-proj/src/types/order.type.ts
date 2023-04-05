
export type Orders = {
    order_id: number
    pair_address: string | null
    status: string | null
    token_price: number | null
    single_price: number | null
    from_price: number | null
    to_price: number | null
    budget: number | null
    order_type: "buy" | "sell" | null
    price_type: "single" | "range" | null
    user_id: number
}