import { BitqueryData, BitqueryStreamData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBitqueryOHLCData } from "@/lib/bitquery/getBitqueryOHLCData";
import { getBitqueryStreamData } from "@/lib/bitquery/getBitqueryStreamData"
import moment from 'moment';

export interface BitqueryDataState {
  value: BitqueryData[];
  streamValue: BitqueryData[];
  forwardTime: any;
  status: "ok" | "loading" | "failed";
}

const initialState: BitqueryDataState = {
  value: [] as BitqueryData[],
  streamValue: [] as BitqueryData[],
  forwardTime: {} as any,
  status: "ok",
};

const transformData = async (data: any) => {
  return data.map((item:any) => ({
    // time: moment(item.timeInterval.minute).format('YYYY-MM-DD'),
    // time: new Date(moment(item.timeInterval.minute).format('YYYY-MM-DD')).getTime(),
    time: (new Date(item.timeInterval.minute + " UTC")).getTime(),
    open: parseFloat(item.open),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
    close: parseFloat(item.close),
  }));
  
};
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
    // time: moment(time).format('YYYY-MM-DD'),
    time: (new Date(time)).getTime(),
    open,
    high,
    low,
    close
  };
}
const getAddData = (forwardTime: any, data:any) => {
  console.log("getAddData");
  const filterData = data.filter((item: any) => item.time < forwardTime);
  const time = forwardTime;
  const open = filterData[0];
  const close = filterData[filterData.length - 1];
  const high = Math.max(...filterData);
  const low = Math.min(...filterData);
  return {
    time,
    open,
    high,
    low,
    close
  }
}
export const getBitqueryInitInfo = createAsyncThunk(
  "bitqueryInitInfo/get",
  async (any,{dispatch}): Promise<any> => {
    const responsData = await getBitqueryOHLCData();
    console.log("dlfkjdlfkj", responsData);
    const tranData = await transformData(responsData);
    dispatch(getBitqueryStreamInfo());
    console.log("after dlddldfjsklaf");
    return tranData;
  }
);
export const initBitqueryData = createAsyncThunk(
  "bitqueryInitInfo/delete",
  async (any,{dispatch}): Promise<any> => {
    console.log("initBitquery");
    return [];
  }
);
export const initBitqueryStreamData = createAsyncThunk(
  "bitqueryStreamInfo/delete",
  async (any,{dispatch}): Promise<any> => {
    console.log("initBitquerystream");
    return [];
  }
);

export const getBitqueryStreamInfo = createAsyncThunk(
  "bitqueryStreamInfo/get",
  async (): Promise<any> => {
    const responsData = await getBitqueryStreamData();
    const tranData = await transformStreamData(responsData);
    console.log("here isfddddddddddddddddddddddddd")
    // return tranData;
  }
);

export const getBitqueryStream = createAsyncThunk<any, any>(
  "bitqueryStream/get",
  async (tranData): Promise<any> => {
    console.log("bitqueryStream/get", tranData);
    return tranData;
  }
);

export const bitquerySlice = createSlice({
  name: "bitqueryInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    console.log("extreRecucers;;;;;;;;");
    builder
      .addCase(getBitqueryInitInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryInitInfo.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = [...state.value, ...action.payload];
        state.forwardTime = action.payload[action.payload.length - 1].time + 2400000;
        // state.value = action.payload;
      })
      .addCase(getBitqueryInitInfo.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initBitqueryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initBitqueryData.fulfilled, (state, action) => {
        console.log("initBitquerydata:", action.payload);
        state.status = "ok";
        state.value = action.payload;
        // state.value = action.payload;
      })
      .addCase(initBitqueryData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initBitqueryStreamData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initBitqueryStreamData.fulfilled, (state, action) => {
        console.log("initBitqueryStreamData:", action.payload);
        state.status = "ok";
        state.streamValue = action.payload;
        // state.value = action.payload;
      })
      .addCase(initBitqueryStreamData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getBitqueryStreamInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryStreamInfo.fulfilled, (state, action) => {
        state.status = "ok";
        state.streamValue = action.payload;
        // state.value = action.payload;
      })
      .addCase(getBitqueryStreamInfo.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getBitqueryStream.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryStream.fulfilled, (state, action) => {
        console.log("action.payload:::::::::",action.payload);
        state.status = "ok";
        let temp = action.payload;
        // temp.time = state.forwardTime;
        state.streamValue = [...state.streamValue, temp];
        if(action.payload.time > state.forwardTime){
          const addData = getAddData(state.forwardTime, state.streamValue);
          console.log("Done");
          state.value = [...state.value, addData];
          state.forwardTime = action.payload.time + 2400000;
        }else{

        }
        // state.streamValue = action.payload;
        // state.value = [...state.value, action.payload];
        // state.value.push(action.payload);
      })
      .addCase(getBitqueryStream.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default bitquerySlice.reducer;
