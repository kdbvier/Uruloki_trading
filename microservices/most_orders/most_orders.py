import logging
from datetime import datetime, timedelta
import time
from sqlalchemy import bindparam, select, cast
from sqlalchemy.sql import text
import sqlalchemy
import requests
import os
from dotenv import load_dotenv


# Load Env Variables
load_dotenv()


logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)
logging.info('Script Started')


SCHEDULE = os.getenv("SCHEDULE")
API_KEY = os.getenv("ETHERSCAN_APIKEY")
WEI_CONST = 10**18


# Set Env Variable


try:
    sqlUrl = sqlalchemy.engine.url.URL(
        drivername="mysql+pymysql",
        username=os.getenv("USERNAME"),
        password=os.getenv("PASSWORD"),
        host=os.getenv("HOST"),
        port=3306,
        database=os.getenv("DATABASE"),
        query={"ssl_ca": "/etc/ssl/certs/ca-certificates.crt"},
    )

    connengine = sqlalchemy.create_engine(sqlUrl)
    metadata = sqlalchemy.MetaData()
    most_buy_orders = sqlalchemy.Table(
        'most_buy_orders', metadata, autoload_with=connengine)

    most_sell_orders = sqlalchemy.Table(
        'most_sell_orders', metadata, autoload_with=connengine)

    logging.info("Connection to database succesffull")
    pass
except Exception as e:
    pass
    print(e)
    logging.error("unable to connect with database")
    logging.error("shutting down")
    exit(0)


connection = connengine.connect()

# empty table
connection.execute(most_buy_orders.delete())
# empty table
connection.execute(most_sell_orders.delete())


def update_sales():

    try:
        # most buys
        connection.execute(text(
            "insert into most_buy_orders(token_cache_id,`rank`) select token_cache.id,rank() over(order by order_type) as _rank from orders inner join token_cache on orders.pair_address = token_cache.pair_address and order_type = 'buy' group by orders.pair_address limit 100;"))
        logging.info("successfully updated most_buy_orders table")
    except Exception as e:
        print(e)
        logging.error(
            "unable to to insert data in most_buy_orders")

    try:
        # most sells
        connection.execute(text(
            "insert into most_sell_orders(token_cache_id,`rank`) select token_cache.id,rank() over(order by order_type) as _rank from orders inner join token_cache on orders.pair_address = token_cache.pair_address and order_type = 'sell' group by orders.pair_address limit 100;"))
        logging.info("successfully updated most_sell_orders table")
    except Exception as e:
        print(e)
        logging.error(
            "unable to to insert data in most_sell_orders")


while True:
    logging.info("Attempting to update database")
    try:
        update_sales()
    except:
        logging.error("something went wrong while updating results")

    time.sleep(int(SCHEDULE))
    logging.info("sleeping zzzzzzzzzzzzzz...")
