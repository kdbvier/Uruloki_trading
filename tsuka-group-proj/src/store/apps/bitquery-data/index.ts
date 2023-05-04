import { BitqueryData, BitqueryStreamData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBitqueryOHLCData } from "@/lib/bitquery/getBitqueryOHLCData";
import { getBitqueryStreamData } from "@/lib/bitquery/getBitqueryStreamData"
import moment from 'moment';

export interface BitqueryDataState {
  value: BitqueryData[];
  streamValue: BitqueryData;
  status: "ok" | "loading" | "failed";
}

const initialState: BitqueryDataState = {
  value: [] as BitqueryData[],
  streamValue: {} as BitqueryData,
  status: "ok",
};

const transformData = async (data: any) => {
  return data.map((item:any) => ({
    time: moment(item.timeInterval.minute).format('YYYY-MM-DD'),
    // time: new Date(moment(item.timeInterval.minute).format('YYYY-MM-DD')).getTime(),
    // time: item.timeInterval.minute,
    open: parseFloat(item.open) * item.baseAmount,
    high: parseFloat(item.high) * item.baseAmount,
    low: parseFloat(item.low) * item.baseAmount,
    close: parseFloat(item.close) * item.baseAmount,
  }));
  
};
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

export const getBitqueryStreamInfo = createAsyncThunk(
  "bitqueryStreamInfo/get",
  async (): Promise<any> => {
    const responsData = await getBitqueryStreamData();
    const tranData = await transformStreamData(responsData);
    console.log("here isfddddddddddddddddddddddddd")
    return tranData;
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
        // state.value = action.payload;
      })
      .addCase(getBitqueryInitInfo.rejected, (state) => {
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
        state.streamValue = action.payload;
        // state.value = [...state.value, action.payload];
        // state.value.push(action.payload);
      })
      .addCase(getBitqueryStream.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default bitquerySlice.reducer;
