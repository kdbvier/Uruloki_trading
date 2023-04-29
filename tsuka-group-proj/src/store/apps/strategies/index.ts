import { strategiesData } from "@/@fake-data/strategies.fake-data";
import { Strategy } from "@/types/strategy.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface StrategiesState {
  value: Array<Strategy>;
  status: "ok" | "loading" | "failed";
}

const initialState: StrategiesState = {
  value: [] as Array<Strategy>,
  status: "ok",
};

export const getStrategies = createAsyncThunk(
  "strategies/get",
  async (): Promise<Array<Strategy>> => {
    return strategiesData;
  }
);

export const strategiesSlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStrategies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStrategies.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getStrategies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default strategiesSlice.reducer;
