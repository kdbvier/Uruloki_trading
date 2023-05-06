import { BitqueryData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBitqueryOHLCData } from "@/lib/bitquery/getBitqueryOHLCData";
import { getBitqueryStreamData, transformData, transformStreamData, getAddData } from "@/lib/bitquery/getBitqueryStreamData"

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
// After fetching the historical data and then fetch the subscription data
// Send the data to the Store 
export const getBitqueryInitInfo = createAsyncThunk(
  "bitqueryInitInfo/get",
  async (any,{dispatch}): Promise<any> => {
    const responsData = await getBitqueryOHLCData();
    const tranData = await transformData(responsData);
    dispatch(getBitqueryStreamInfo());
    return tranData;
  }
);
// initialize the historical data in the Store
export const initBitqueryData = createAsyncThunk(
  "bitqueryInitInfo/delete",
  async (any,{dispatch}): Promise<any> => {
    return [];
  }
);
// initialize the sunscription data in the Store
export const initBitqueryStreamData = createAsyncThunk(
  "bitqueryStreamInfo/delete",
  async (any,{dispatch}): Promise<any> => {
    return [];
  }
);
// fetch the subscription data from the Bitquery
export const getBitqueryStreamInfo = createAsyncThunk(
  "bitqueryStreamInfo/get",
  async (): Promise<any> => {
    const responsData = await getBitqueryStreamData();
    const tranData = await transformStreamData(responsData);
  }
);

export const getBitqueryStream = createAsyncThunk<any, any>(
  "bitqueryStream/get",
  async (tranData): Promise<any> => {
    return tranData;
  }
);

export const bitquerySlice = createSlice({
  name: "bitqueryInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBitqueryInitInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBitqueryInitInfo.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = [...state.value, ...action.payload];
        state.forwardTime = action.payload[action.payload.length - 1].time + 2400000;
      })
      .addCase(getBitqueryInitInfo.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initBitqueryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initBitqueryData.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(initBitqueryData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(initBitqueryStreamData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initBitqueryStreamData.fulfilled, (state, action) => {
        state.status = "ok";
        state.streamValue = action.payload;
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
        state.status = "ok";
        let temp = action.payload;
        // temp.time = state.forwardTime;
        state.streamValue = [...state.streamValue, temp];
        if(action.payload.time > state.forwardTime){
          if(action.payload.time > state.forwardTime + 2400000){
            // state.value = [...state.value, ...action.payload];
          }else{
            // const addData = getAddData(state.forwardTime, state.streamValue);
            // state.value = [...state.value, addData];
            state.forwardTime = state.forwardTime + 2400000;
          }
        }
      })
      .addCase(getBitqueryStream.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default bitquerySlice.reducer;
