import { tokensData } from "@/@fake-data/token.fake-data";
import { Token } from "@/types/token.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenState {
  value: Token;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenState = {
  value: {} as Token,
  status: "ok",
};

export const getToken = createAsyncThunk("token/get", async (id: string) => {
  const data = tokensData.find((item) => item.id === id)!;
  return data;
});

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
