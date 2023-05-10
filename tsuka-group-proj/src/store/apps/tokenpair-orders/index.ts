import Orders from "@/lib/api/orders";
import { Order } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenpairOrders {
  value: { pair_address: string; orders: Order[] };
  status: "ok" | "loading" | "failed";
}

const initialState: TokenpairOrders = {
  value: {
    pair_address: "",
    orders: [] as Order[],
  },
  status: "ok",
};

export const getOrdersbyTokenPair = createAsyncThunk(
  "tokens/get",
  async (pair_address: string) => {
    const orders = await Orders.getActiveOrdersbyTokenPair(pair_address);
    return {
      pair_address,
      orders,
    };
  }
);

export const tokenpairOrders = createSlice({
  name: "homePageTokens",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersbyTokenPair.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrdersbyTokenPair.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getOrdersbyTokenPair.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenpairOrders.reducer;
