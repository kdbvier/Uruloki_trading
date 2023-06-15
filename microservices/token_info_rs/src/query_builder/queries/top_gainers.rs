pub fn query() -> String {
    r#"query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
        ethereum(network: $network) {
            dexTrades(
                options: {desc: "count", limit: $limit, offset: $offset}
                date: {since: $from, till: $till}
                buyCurrency: {
                    notIn: [
                        "0x6B175474E89094C44Da98b954EedeAC495271d0F", 
                        "0xdAC17F958D2ee523a2206206994597C13D831ec7", 
                        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 
                        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", 
                        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                    ]
                }
            ) {
                sellCurrency {
                    symbol
                    name
                    address
                }
                buyCurrency {
                    symbol
                    name
                    address
                }
                count
                latest_price: maximum(of: block, get: price)
                earliest_price: minimum(of: block, get: price)
                volumeUSD: tradeAmount(in: USD)
                smartContract {
                    address {
                        address
                    }
                }
            }
        }
    }"#.to_string()
}