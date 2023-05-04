import { request, gql } from 'graphql-request';
import { createSubscriptionClient } from './subscription-client';
import { getBitqueryStream } from '@/store/apps/bitquery-data';
import { store } from '@/store';
import moment from 'moment';

const BITQUERY_API_ENDPOINT = 'https://streaming.bitquery.io/graphql';
const client = createSubscriptionClient();

const transformStreamData = (data: any) => {
  console.log("DEX",data.data.EVM);
  const buySide = data.data.EVM ?.buyside;
  const sellSide = data.data.EVM ?.sellside;
  console.log("buySide",buySide);
  console.log("sellSide",sellSide);

  // const prices = data.data.EVM.DEXTrades.map((trade: any) => trade.Trade.Buy.Price);
  // const open = prices[0];

  const buySideTime = buySide.length !== 0 ? buySide[buySide.length-1].Block.Time : ""; 
  const buySideOpen = buySide.length !== 0 ? buySide[0].Trade.Buy.Price : "";  
  const buySideHigh = buySide.length !== 0 ? Math.max(...buySide.map((item:any) => item.Trade.Buy.Price)) : "";
  const buySideLow = buySide.length !== 0 ? Math.min(...buySide.map((item:any) => item.Trade.Buy.Price)) : ""; 
  const buySideClose = buySide.length !== 0 ? buySide[buySide.length -1].Trade.Buy.Price : ""; 

  const sellSideTime = sellSide.length !== 0 ? sellSide[sellSide.length -1].Block.Time : ""; 
  const sellSideOpen = sellSide.length !== 0 ? sellSide[0].Trade.Buy.Price : "";  
  const sellSideHigh = sellSide.length !== 0 ? Math.max(...sellSide.map((item:any) => item.Trade.Buy.Price)) : "";
  const sellSideLow = sellSide.length !== 0 ? Math.min(...sellSide.map((item:any) => item.Trade.Buy.Price)) : ""; 
  const sellSideClose = sellSide.length !== 0 ? sellSide[sellSide.length -1].Trade.Buy.Price : ""; 
  console.log("buySideTime",buySideTime);
  console.log("buySideClose",buySideClose);

  const time = buySideTime !== "" ? buySideTime : sellSideTime; 
  const open = buySideOpen !== "" ? buySideOpen : sellSideOpen; 
  const high = buySideHigh !== "" ? buySideHigh : sellSideHigh; 
  const low = buySideLow !== "" ? buySideLow : sellSideLow; 
  const close = buySideClose !== "" ? buySideClose : sellSideClose; 

  // const high = prices[0];
  // const low = prices[0];
  // const time =  moment(data.data.EVM.DEXTrades[0].Block.Time).format('YYYY-MM-DD');
  
  return {
    time: moment(time).format('YYYY-MM-DD'),
    open,
    high,
    low,
    close
  };
}
// WETH trades
const fetchStreamData = async () => {
  if (typeof window !== 'undefined') {
    const subscription = client.request({
      query: `
        subscription RealTimeBlocks {
          EVM(network: eth, trigger_on: head) {
            buyside: DEXTrades(
              orderBy: {descending: Block_Time}
              where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}}}}}
            ) {
              Block {
                Number
                Time
              }
              Transaction {
                From
                To
                Hash
              }
              Trade {
                Buy {
                  Amount
                  Buyer
                  Currency {
                    Name
                    Symbol
                    SmartContract
                  }
                  Seller
                  Price
                }
                Sell {
                  Amount
                  Buyer
                  Currency {
                    Name
                    SmartContract
                    Symbol
                  }
                  Seller
                  Price
                }
              }
            }
            sellside: DEXTrades(
              orderBy: {descending: Block_Time}
              where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}}}
            ) {
              Block {
                Number
                Time
              }
              Transaction {
                From
                To
                Hash
              }
              Trade {
                Buy {
                  Amount
                  Buyer
                  Currency {
                    Name
                    Symbol
                    SmartContract
                  }
                  Seller
                  Price
                }
                Sell {
                  Amount
                  Buyer
                  Currency {
                    Name
                    SmartContract
                    Symbol
                  }
                  Seller
                  Price
                }
              }
            }
          }
        }
      `
    }).subscribe({
      next: async (response: any) => {
        // handle subscription data
        console.log(response);
        // const data = await response.json(); 
        const transData = transformStreamData(response);
        console.log("here is", transData)
        store.dispatch(getBitqueryStream(transData));
        return transData;
      },
      error: (error: any) => {
        // handle subscription errors
        console.log(error);
      },
      complete: () => {
        // handle subscription completion
        console.log("complete");
      },
    })
  };
};

export const getBitqueryStreamData = async () => {
  const streamData = await fetchStreamData();
  // console.log("getBitqueryStreamData:", streamData);
};
export const stopBitqueryStream = async () => {
  client.unsubscribeAll();
  console.log("unsubscripbe");
};