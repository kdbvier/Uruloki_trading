import { tokensData } from "@/@fake-data/token.fake-data";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { getTokenBoundData } from "@/store/apps/new-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export default function Pair({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.tokenBound);
  const router = useRouter();
  const { pair_id = id || "" } = router.query;
  const inputToken = tokensData
    .map((token) => {
      return { id: token.id, token: token.chain.code };
    })
    .find((item) => item.id === pair_id)!;

  const currentToken = tokensData.find((item) => item.id === id)!;
  const compareToken = tokensData.find((item) => item.id !== id)!;

  const outputBoundData = useMemo(() => {
    const v = value.pairs.find((item) => {
      if (item.code === compareToken.chain.code) {
        return { buy: item.buy, values: item.values };
      }
    })!;
    return {
      id: compareToken.id,
      name: compareToken.chain.name,
      code: compareToken.chain.code,
      boundData: {
        buy: v.buy,
        values: v.values,
      },
    };
  }, [value, compareToken]);

  const inputBoundData = useMemo(() => {
    return {
      id: currentToken.id,
      name: currentToken.chain.name,
      code: currentToken.chain.code,
      boundData: {
        buy: value.bound.buy,
        values: value.bound.values,
      },
    };
  }, [value, currentToken]);

  useEffect(() => {
    dispatch(getTokenBoundData(currentToken.id));
  }, [dispatch, currentToken]);

  return (
    <div className="flex flex-col">
      {inputToken && (
        <>
          <FullHeaderToken token={inputToken} />
          <div className="hidden md:grid grid-cols-11 gap-4">
            {/* <div className="col-span-12 md:col-span-3">
              <CompareTokenChainToken token={inputToken} networks={networks} />
            </div> */}
            <div className="col-span-12 md:col-span-8">
              <LiveGraphToken token={inputToken} />
              <div className="hidden md:grid grid-cols-8 gap-4">
                <div className="col-span-12 md:col-span-3">
                  <PoolInfoToken token={inputToken} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <AllPositionsToken token={inputToken} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              {status === "loading" && "Loading..."}
              {status === "ok" && value && (
                <OrderWidgetToken
                  inputToken={inputBoundData}
                  outputToken={outputBoundData}
                />
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <LiveGraphToken token={inputToken} />
            <OrderWidgetToken
              inputToken={inputBoundData}
              outputToken={outputBoundData}
            />
            <AllPositionsToken token={inputToken} />
            <PoolInfoToken token={inputToken} />
          </div>
        </>
      )}
    </div>
  );
}
