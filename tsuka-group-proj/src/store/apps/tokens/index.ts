import HomePageTokens from "@/lib/api/tokens";
import { Tokens } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokensState {
  value: Tokens;
  status: "ok" | "loading" | "failed";
}

const initialState: TokensState = {
  value: {} as Tokens,
  status: "ok",
};

export const getHomrPageTokens = createAsyncThunk("tokens/get", async () => {
    return await HomePageTokens.getTokens();
  }
);

export const homePageTokenSlice = createSlice({
  name: "homePageTokens",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHomrPageTokens.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHomrPageTokens.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getHomrPageTokens.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default homePageTokenSlice.reducer;
