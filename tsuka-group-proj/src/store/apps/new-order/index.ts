import { TokenBoundData, newOrderData } from "@/@fake-data/new-order.fake-data";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenBoundDataState {
  value: TokenBoundData;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenBoundDataState = {
  value: {} as TokenBoundData,
  status: "ok",
};

export const getTokenBoundData = createAsyncThunk(
  "tokenBoundData/get",
  async (id: string) => {
    const data = newOrderData.find((item) => item.id === id)!;
    return data;
  }
);

export const tokenBoundDataSlice = createSlice({
  name: "tokenBoundData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTokenBoundData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenBoundData.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenBoundData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenBoundDataSlice.reducer;
