import { tokensData } from "@/@fake-data/token.fake-data";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { getTokenOrderData } from "@/store/apps/new-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChartBound } from "@/types/chart-bound.type";
import { Token } from "@/types/token.type";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
interface InputToken {
  id: string;
  token: string;
}

interface BoundData {
  id: string;
  name: string;
  code: string;
  boundData: ChartBound;
}
export default function Pair({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { value } = useAppSelector((state) => state.tokenBound);
  const router = useRouter();
  const [inputToken, setInputToken] = useState<InputToken>();
  const [currentToken, setCurrentToken] = useState<Token>();
  const [compareToken, setCompareToken] = useState<Token>();

  useEffect(() => {
    const { pair_id = id || "" } = router.query;
    const inputToken = tokensData
      .map((token) => {
        return { id: token.id, token: token.chain.code };
      })
      .find((item) => item.id === pair_id)!;
    const currentToken = tokensData.find((item) => item.id === pair_id)!;
    const compareToken = tokensData.find((item) => item.id !== pair_id)!;
    setInputToken(inputToken);
    setCurrentToken(currentToken);
    setCompareToken(compareToken);
  }, [id, router.query]);

  useEffect(() => {
    if (currentToken) {
      dispatch(getTokenOrderData(currentToken.id));
    }
  }, [dispatch, currentToken]);

  const orders = useMemo(() => {
    const { orders } = value;
    return orders;
  }, [value]);

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
              {currentToken && compareToken && (
                <OrderWidgetToken
                  name1={currentToken?.chain.name as string}
                  code1={currentToken?.chain.code as string}
                  name2={compareToken?.chain.name as string}
                  code2={compareToken?.chain.code as string}
                  orders={orders}
                />
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <LiveGraphToken token={inputToken} />
            {currentToken && compareToken && (
              <OrderWidgetToken
                name1={currentToken?.chain.name as string}
                code1={currentToken?.chain.code as string}
                name2={compareToken?.chain.name as string}
                code2={compareToken?.chain.code as string}
                orders={orders}
              />
            )}
            <AllPositionsToken token={inputToken} />
            <PoolInfoToken token={inputToken} />
          </div>
        </>
      )}
    </div>
  );
}
