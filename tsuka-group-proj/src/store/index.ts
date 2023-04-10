import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import tokenBoundSlice from "./apps/new-order";
import poolInfoSlice from "./apps/pool-info";
import tokenSlice from "./apps/token";
import tokenCompareSlice from "./apps/token-compare";
import tokenPositionSlice from "./apps/token-positions";

export const store = configureStore({
  reducer: {
    poolInfo: poolInfoSlice,
    token: tokenSlice,
    tokenCompare: tokenCompareSlice,
    tokenPosition: tokenPositionSlice,
    tokenBound: tokenBoundSlice,
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
