use serde::{Deserialize, Serialize};
use serde_json::Value;
use reqwest::header::{HeaderMap, HeaderValue};
use reqwest::StatusCode;

#[derive(Debug, Serialize, Deserialize)]
struct BitqueryResponse {
    data: Option<Value>,
    status: Option<i32>,
    error: Option<String>,
}


async fn get_ohlc_data() -> Result<Vec<BitqueryResponse>, reqwest::Error> {
    let url = "https://graphql.bitquery.io";
    let query = r#"
        {
            ethereum(network: bsc) {
                dexTrades(
                    options: {desc: "timeInterval.minute"}
                    date: {since: "2022-01-01"}
                    baseCurrency: {is: "0x55d398326f99059ff775485246999027b3197955"}
                    quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
                ) {
                    timeInterval {
                        minute(count: 1)
                    }
                    baseCurrency {
                        symbol
                    }
                    quoteCurrency {
                        symbol
                    }
                    openPrice: open
                    highPrice: high
                    lowPrice: low
                    closePrice: close
                    trades: count
                    quoteAmount
                    quotePrice
                }
            }
        }
    "#;
    let mut headers = HeaderMap::new();
    headers.insert("X-API-KEY", HeaderValue::from_static("BQYXORRJLNLsav7kdhyIMBeUUH3DlgwH"));
    let client = reqwest::Client::builder().default_headers(headers).build()?;
    let response = client.post(url).json(&json!({ "query": query })).send().await?;
    let status = response.status();
    let body = response.text().await?;
    let result: BitqueryResponse = serde_json::from_str(&body)?;
    if status != StatusCode::OK {
        Err(reqwest::Error::from(response))
    } else if result.status != Some(200) || result.error.is_some() {
        Err(reqwest::Error::from(format!(
            "Bitquery error: {:?}",
            result.error.unwrap_or_else(|| "".to_string())
        )))
    } else {
        let data = result
            .data
            .ok_or_else(|| reqwest::Error::from("No data in response"))?;
        let trades = data["ethereum"]["dexTrades"].as_array().unwrap_or_default();
        let ohlc_data = trades
            .iter()
            .map(|trade| serde_json::from_value(trade.clone()))
            .collect::<Result<Vec<BitqueryResponse>, serde_json::Error>>()?;
        Ok(ohlc_data)
    }
}


fn main() {
    match tokio::runtime::Runtime::new().unwrap().block_on(get_ohlc_data()) {
        Ok(data) => println!("{:#?}", data),
        Err(e) => eprintln!("Error: {}", e),
    }
}
