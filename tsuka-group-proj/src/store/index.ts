import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import poolInfoSlice from "./apps/pool-info";
import strategiesSlice from "./apps/strategies";
import strategyDetailsSlice from "./apps/strategy-details";
import tokenSlice from "./apps/token";
import tokenCompareSlice from "./apps/token-compare";
import tokenHistoryPositionSlice from "./apps/token-history-positions";
import tokenPositionSlice from "./apps/token-positions";
import userOrderSlice from "./apps/user-order";

export const store = configureStore({
  reducer: {
    poolInfo: poolInfoSlice,
    token: tokenSlice,
    tokenCompare: tokenCompareSlice,
    tokenPosition: tokenPositionSlice,
    tokenHistoryPosition: tokenHistoryPositionSlice,
    userOrder: userOrderSlice,
    strategies: strategiesSlice,
    strategyDetails: strategyDetailsSlice,
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
