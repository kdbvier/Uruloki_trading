import requests
import json
import pandas
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

import pymysql
pymysql.install_as_MySQLdb()

# Load Env Variables
load_dotenv()


# Set Env Variable
TIMERANGE = os.getenv("TOP_GAINERS_TIME_RANGE")
URL = "https://graphql.bitquery.io"
API_KEY = os.getenv("BITQUERY_APIKEY")
TXCOUNTLIMIT = os.getenv("MINTXCOUNT")

# db configurations
connection = pymysql.connect(
    host=os.getenv("HOST"),
    user=os.getenv("USERNAME"),
    passwd=os.getenv("PASSWORD"),
    db=os.getenv("DATABASE"),
    ssl_disabled=False,
    ssl={
        "ca": "/etc/ssl/certs/ca-certificates.crt"
    }
)


def convert_prices_to_usdt(currencies: list[str]):
    pass

    params = {
        "network": "ethereum",
        "currencies": currencies,
        "date": datetime.utcnow().strftime("%Y-%m-%d")
    }

    payload = json.dumps({
        "query": "query ($network: EthereumNetwork!, $currencies: [String!], $date: ISO8601DateTime) {\n  ethereum(network: $network) {\n    dexTrades(\n      exchangeName: {is: \"Uniswap\"}\n      buyCurrency: {in: $currencies}\n      sellCurrency: {is: \"0xdac17f958d2ee523a2206206994597c13d831ec7\"}\n      date: {till: $date}\n    ) {\n      buyCurrency {\n        symbol\n        address\n      }\n      last_price: maximum(of: block, get: price)\n    }\n  }\n}\n",
        "variables": params
    })

    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
    }

    response = requests.request("POST", URL, headers=headers, data=payload)
    res = json.loads(response.text)

    # prices in usdt
    return pandas.json_normalize(res['data']['ethereum'], 'dexTrades')


# configure request time range
def get_top_gainers():

    B = datetime.utcnow()
    A = B - timedelta(hours=float(TIMERANGE))
    From = A.strftime("%Y-%m-%dT%H:%M:%S")
    Till = B.strftime("%Y-%m-%dT%H:%M:%S")
    network = "ethereum"
    params = {
        "limit": 10000,
        "offset": 0,
        "network": network,
        "from": From,
        "till": Till,
        "dateFormat": "%Y-%m-%dT%H:%M:%S"
    }

    payload = json.dumps({
        "query": "query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    dexTrades(\n      options: {desc: \"count\", limit: $limit, offset: $offset}\n      date: {since: $from, till: $till}\n    ) {\n      sellCurrency {\n        symbol\n        name\n        address\n      }\n      buyCurrency {\n        symbol\n        name\n        address\n      }\n      count\n      latest_price: maximum(of: block, get: price)\n      earliest_price: minimum(of: block, get: price)\n      volumeUSD: tradeAmount(in: USD)\n    }\n  }\n}\n",
        "variables": params
    })
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
    }

    response = requests.request("POST", URL, headers=headers, data=payload)
    res = json.loads(response.text)

    main_data_frame = pandas.json_normalize(
        res['data']['ethereum'], 'dexTrades')
    main_data_frame['latest_price'] = pandas.to_numeric(
        main_data_frame['latest_price'])
    main_data_frame['earliest_price'] = pandas.to_numeric(
        main_data_frame['earliest_price'])

    # remove un needed data
    main_data_frame['poolAddress'] = main_data_frame['smartContract.address.address']
    # del main_data_frame['tradeAmount']

    data_frame = main_data_frame.query(
        'count > {}'.format(TXCOUNTLIMIT)).copy()
    data_frame['price_movement'] = data_frame['latest_price'] - \
        data_frame['earliest_price']

    # convert price to USDT
    uniqueTokens = data_frame["sellCurrency.address"].unique().tolist()
    df_usdt_prices = convert_prices_to_usdt(uniqueTokens)

    # sort based on price and return
    mergedPD = pandas.merge_ordered(data_frame, df_usdt_prices, how="left",
                                    left_on="sellCurrency.address", right_on="buyCurrency.address")
    mergedPD['last_price'] = pandas.to_numeric(mergedPD['last_price'])
    mergedPD["price_movement_USD"] = mergedPD["price_movement"] * \
        mergedPD["last_price"]
        
    #latest price has units (token A ). last_price has units (USD for token B)
    mergedPD["token_price_USD"] = mergedPD["latest_price"] *  mergedPD["last_price"]
    mergedPD = mergedPD.sort_values("price_movement_USD", ascending=False)

    return mergedPD







