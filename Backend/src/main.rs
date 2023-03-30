use reqwest::{Client, Error};
use serde::{Deserialize, Serialize};
use serde_json::json;
use serde_json::Value;
use std::collections::HashMap;

#[derive(Debug, serde::Deserialize)]
struct BitqueryResponse {
    data: OHLCData,
}

#[derive(Debug, serde::Deserialize)]
struct OHLCData {
    trades: Vec<OHLC>,
}

#[derive(Debug, serde::Deserialize)]
struct OHLC {
    time: TIMEINTERVALData,
    volume: f64,
    high: f64,
    low: f64,
    open: String,
    close: String,
}

#[derive(Debug, serde::Deserialize)]
struct TIMEINTERVALData {
    minute: String
}


async fn fetch_ohlc_data() -> Result<(), Error> {
    let url = "https://graphql.bitquery.io/";
    let api_key = "BQYXORRJLNLsav7kdhyIMBeUUH3DlgwH";
    let query = r#"
        query ($network: String!,$from: ISO8601DateTime!, $to: ISO8601DateTime!, $exchangeAddress: String!,$baseCurrency: String!,$quoteCurrency: String!,$tradeAmountUsd:u64!,$count:u64! ) {
            ethereum(network: bsc) {
                dexTrades(
                  options: {asc: "timeInterval.minute"}
                  date: {since: "2021-06-20T07:23:21.000Z", till: "2021-06-23T15:23:21.000Z"}
                  exchangeAddress: {is: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"}
                  baseCurrency: {is: "0x2170ed0880ac9a755fd29b2688956bd959f933f8"},
                  quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"},
                  tradeAmountUsd: {gt: 10}
                ) 
                {
                  timeInterval {
                    minute(count: 15, format: "%Y-%m-%dT%H:%M:%SZ")  
                  }
                  volume: quoteAmount
                  high: quotePrice(calculate: maximum)
                  low: quotePrice(calculate: minimum)
                  open: minimum(of: block, get: quote_price)
                  close: maximum(of: block, get: quote_price) 
                }
            }
        }
    "#;

    let client = Client::new();
    let response = client
        .post(url)
        .header("X-API-KEY", api_key)
        .json(&json!({
            "query": query,
            "variables": {
                "network":"bsc",
                "from": "2022-01-01T00:00:00Z",
                "to": "2022-01-02T00:00:00Z",
                "exchangeAddress": "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
                "baseCurrency": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
                "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                "tradeAmountUsd": 10,
                "count": 15,
            }
        }))
        .send().await?;


    let response_json: Value = response.json().await?;
    let dex_trades = &response_json["data"]["ethereum"]["dexTrades"];


    println!("dex trades -> {}",dex_trades);
    

    // let ohlc_data = response.data.trades;
    // for trade in ohlc_data {
    //     println!("volume: {}", trade.volume);
    //     println!("high: {}", trade.high);
    //     println!("low: {}", trade.low);
    //     println!("open: {}",trade.open);
    //     println!("close: {}", trade.close);
    //     println!("Timestamp: {}", trade.time.minute);
    // }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    fetch_ohlc_data().await
}
