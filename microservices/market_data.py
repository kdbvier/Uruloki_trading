import requests
import os
from dotenv import load_dotenv

# Load Env Variables
load_dotenv()

API_KEY = os.getenv("ETHERSCAN_APIKEY")
WEI_CONST=10**18

def update_market_cap(contract_address, price_usd):

    try:
        url = f'https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress={contract_address}&apikey={API_KEY}'
        response = requests.get(url)
        data = response.json()
        if data['status'] == '1':
            # Convert from wei to ether
            circulating_supply = float(data['result']) / WEI_CONST
            # Replace current_price with the actual price of the token
            market_cap = circulating_supply * float(price_usd)
            return market_cap

    except:
        pass

    return "-"
