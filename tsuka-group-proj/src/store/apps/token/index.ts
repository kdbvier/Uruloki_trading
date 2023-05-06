import { tokensData } from "@/@fake-data/token.fake-data";
import Orders from "@/lib/api/orders";
import { Token } from "@/types/token.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenState {
  value: Token;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenState = {
  value: {
    id: "1",
    token: "Ethereum",
    chain: {
      name: "Ethereum",
      code: "ETH",
      address: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed",
    },
    pair: {
      code: "BTC",
      name: "Bitcoin",
      address: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed",
    },
    price: {
      value: "29,095.9888201",
      operator: "+",
      variationValue: 0.76,
      variationValueDiference: 0.00523,
    },
    volume: {
      value: "32,987.54",
      currencyLabel: "Billions",
    },
    marketCap: {
      value: "476,892,747,054",
      currencyLabel: "Billions",
    },
    nOrders: {
      value: "103,912",
      currencyLabel: "Millions",
    },
    orderSplit: {
      buy: 3782,
      sell: 3154,
    },
  } as Token,
  status: "ok",
};

export const getToken = createAsyncThunk(
  "token/get",
  async (id: string): Promise<Token> => {
    const data = tokensData.find((item) => item.id === id)!;
    return data;
  }
);

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getToken.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenSlice.reducer;
