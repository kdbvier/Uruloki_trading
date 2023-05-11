import { tokensData } from "@/@fake-data/token.fake-data";
import { RootState } from "@/store";
import { Token } from "@/types/token.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface TokenState {
  value: Token;
  status: "ok" | "loading" | "failed";
}

const initialState: TokenState = {
  value: {
    id: "",
    token: "Ethereum",
    chain: {
      name: "Ethereum",
      code: "ETH",
      address: "",
    },
    pair: {
      code: "BTC",
      name: "Bitcoin",
      address: "",
    },
    price: {
      value: "",
      operator: "+",
      variationValue: 0,
      variationValueDiference: 0,
    },
    volume: {
      value: "0",
      currencyLabel: "",
    },
    marketCap: {
      value: "0",
      currencyLabel: "",
    },
    nOrders: {
      value: "0",
      currencyLabel: "",
    },
    orderSplit: {
      buy: 0,
      sell: 0,
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

export const getTokenByStrategyId = createAsyncThunk(
  "token/getByStrategyId",
  async (id: string): Promise<Token> => {
    const data = tokensData.find((item) => item?.strategy_id === id)!;
    return data;
  }
);

export const setOrderSplit = createAsyncThunk(
  "token/setOrderSplit",
  async(Param: {
    orderSplit: {
      buy: number,
      sell: number
    },
    volume: {
      value: string,
      currencyLabel: string
    },
    price: {
      value: string,
      operator: string,
      variationValue: number,
    }
  }, { getState }): Promise<any> => {
  const previousState = (getState() as RootState).token;
  const data = {
    ...previousState.value,
    orderSplit: {
      buy: Param.orderSplit.buy,
      sell: Param.orderSplit.sell
    },
    volume: {
      value: Param.volume.value,
      currencyLabel: Param.volume.currencyLabel
    },
    price: {
      value: Param.price.value,
      operator: Param.price.operator,
      variationValue: Param.price.variationValue,
    }
  }
  return data;
}
)

export const setPairAddress = createAsyncThunk(
  "token/setPairAddress",
  async (pair: string, { getState }): Promise<any> => {
    const previousState = (getState() as RootState).token;
    const data = {
      ...previousState.value,
      pair: {
        ...previousState.value.pair,
        address: pair
      }
    };
    console.log("setPair", data);
    
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
      })
      .addCase(getTokenByStrategyId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTokenByStrategyId.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(getTokenByStrategyId.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(setOrderSplit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setOrderSplit.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(setOrderSplit.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(setPairAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setPairAddress.fulfilled, (state, action) => {
        state.status = "ok";
        state.value = action.payload;
      })
      .addCase(setPairAddress.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default tokenSlice.reducer;
