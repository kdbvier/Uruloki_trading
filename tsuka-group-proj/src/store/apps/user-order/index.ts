import { UserOrder, userOrder } from "@/@fake-data/user-order.fake-data";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface UserOrderState {
  value: UserOrder;
  status: "ok" | "loading" | "failed";
}

const initialState: UserOrderState = {
  value: {} as UserOrder,
  status: "ok",
};

export const getUserOrder = createAsyncThunk(
  "userOrder/get",
  async (id: string) => {
    const data = userOrder.find((item) => item.id === id)!;
    return data;
  }
);

export const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserOrder.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getUserOrder.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default userOrderSlice.reducer;
