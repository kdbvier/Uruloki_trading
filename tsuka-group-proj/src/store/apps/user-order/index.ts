import { userOrder } from "@/@fake-data/user-order.fake-data";
import Orders from "@/lib/api/orders";
import { Order, PatchOrder } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface UserOrderState {
  selectedOrder: Order;
  value: UserOrder[];
  status: "ok" | "loading" | "failed";
}

const initialState: UserOrderState = {
  selectedOrder: {} as Order,
  value: [] as UserOrder[],
  status: "ok",
};

export const setSelectedOrder = createAsyncThunk(
  "",
  async (order_id:number):Promise<void> => {
    
  }
);

interface updateEditOrderParams {
  id: string,
  patchData: PatchOrder
}
export const EditUserOrder = createAsyncThunk<unknown, updateEditOrderParams, {dispatch:any}>(
  "userOrder/post",
  async ({id, patchData}, {dispatch}):Promise<Order> => {
    // const data = userOrder.find((item) => item.id === id)!;
    const data = await Orders.editOrder(id, patchData);
    console.log("data updated")

    const user_id = '1'
    if(data){
      dispatch(getUserOrder(user_id))
    }
    return data;
  }
);

export const getUserOrder = createAsyncThunk(
  "userOrder/get",
  async (id: string) => {
    // const data = userOrder.find((item) => item.id === id)!;
    const data = await Orders.getOrdersbyUserId(id)
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
