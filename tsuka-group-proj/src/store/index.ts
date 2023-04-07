import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import poolInfoSlice from "./apps/pool-info";
import tokenCompareSlice from "./apps/token-compare";
import tokenPositionSlice from "./apps/token-positions";

export const store = configureStore({
  reducer: {
    poolInfo: poolInfoSlice,
    tokenCompare: tokenCompareSlice,
    tokenPosition: tokenPositionSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
