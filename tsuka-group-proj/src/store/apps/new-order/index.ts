import { TokenOrderData, newOrderData } from "@/@fake-data/new-order.fake-data";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenOrderDataState {
  value: TokenOrderData;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenOrderDataState = {
  value: {} as TokenOrderData,
  status: "ok",
};

export const getTokenOrderData = createAsyncThunk(
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
      .addCase(getTokenOrderData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenOrderData.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenOrderData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenBoundDataSlice.reducer;
