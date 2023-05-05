import { request, gql } from 'graphql-request';
import { createSubscriptionClient } from './subscription-client';
import { getBitqueryStream, initBitqueryData, initBitqueryStreamData } from '@/store/apps/bitquery-data';
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

  let buySideFiltered = buySide.length !== 0 ? buySide
  .filter((item: any) => item.Trade.Sell.Currency.Symbol === "USDC") : [];

  let { buySidePrices, buySideTimes } = buySideFiltered.reduce((acc: any, item: any) => {
    acc.buySidePrices.push(item.Trade.Buy.Price);
    acc.buySideTimes.push(item.Block.Time);
    return acc;
  }, { buySidePrices: [], buySideTimes: [] });
  let sellSideFiltered = sellSide.length !== 0 ? sellSide
  .filter((item: any) => item.Trade.Sell.Currency.Symbol === "USDC") : [];
  let { sellSidePrices, sellSideTimes } = sellSideFiltered.reduce((acc: any, item: any) => {
    acc.sellSidePrices.push(item.Trade.Buy.Price);
    acc.sellSideTimes.push(item.Block.Time);
    return acc;
  }, { sellSidePrices: [], sellSideTimes: [] });

  // const prices = data.data.EVM.DEXTrades.map((trade: any) => trade.Trade.Buy.Price);
  // const open = prices[0];
  const buySideTime = buySideTimes.length !== 0 ? buySideTimes[buySideTimes.length-1] : ""; 
  const buySideOpen = buySidePrices.length !== 0 ? buySidePrices[0] : "";  
  const buySideHigh = buySidePrices.length !== 0 ? Math.max(...buySidePrices) : ""
  const buySideLow = buySidePrices.length !== 0 ? Math.min(...buySidePrices) : ""; 
  const buySideClose = buySidePrices.length !== 0 ? buySidePrices[buySidePrices.length -1] : ""; 

  const sellSideTime = sellSideTimes.length !== 0 ? sellSideTimes[sellSideTimes.length -1] : ""; 
  const sellSideOpen = sellSidePrices.length !== 0 ? sellSidePrices[0] : "";  
  const sellSideHigh = sellSidePrices.length !== 0 ? Math.max(...sellSidePrices) : "";
  const sellSideLow = sellSidePrices.length !== 0 ? Math.min(...sellSidePrices) : "";
  const sellSideClose = sellSidePrices.length !== 0 ? sellSidePrices[sellSidePrices.length -1] : ""; 
  
  const time = buySideTime !== "" ? buySideTime : sellSideTime; 
  const open = buySideOpen !== "" ? buySideOpen : sellSideOpen; 
  const high = buySideHigh !== "" ? buySideHigh : sellSideHigh; 
  const low = buySideLow !== "" ? buySideLow : sellSideLow; 
  const close = buySideClose !== "" ? buySideClose : sellSideClose; 
  
  console.log("sellSideTime",sellSideTime);

  return {
    // time: moment(time).format('YYYY-MM-DD'),
    time: (new Date(time)).getTime(),
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
              where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"}}}}}
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
        if(transData.open != "")
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
  store.dispatch(initBitqueryData());
  store.dispatch(initBitqueryStreamData());

};