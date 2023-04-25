import { tokensData } from "@/@fake-data/token.fake-data";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { getToken } from "@/store/apps/token";
import { getUserOrder } from "@/store/apps/user-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import { Token } from "@/types/token.type";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const {
    token: { value: token },
    userOrder: { value: userOrder },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const [currentToken, setCurrentToken] = useState<Token>();
  const [compareToken, setCompareToken] = useState<Token>();
  const [statusOrder, setStatusOrder] = useState(OrderStatusEnum.ACTIVE);
  const { pair_id = id || "" } = router.query;

  useEffect(() => {
    dispatch(getToken(pair_id as string));
  }, [dispatch, pair_id]);

  useEffect(() => {
    if (token) {
      dispatch(getUserOrder(token.id));
    }
    const currentToken = tokensData.find((item) => item.id === pair_id)!;
    const compareToken = tokensData.find((item) => item.id !== pair_id)!;
    setCurrentToken(currentToken);
    setCompareToken(compareToken);
  }, [dispatch, pair_id, token]);

  const orders = useMemo((): Array<SingleOrder | RangeOrder> => {
    return userOrder?.orders;
  }, [userOrder]);

  return (
    <div className="flex flex-col">
      {token && (
        <>
          <FullHeaderToken token={token} />
          <div className="hidden md:grid grid-cols-11 gap-4">
            {/* <div className="col-span-12 md:col-span-3">
              <CompareTokenChainToken token={token} networks={networks} />
            </div> */}
            <div className="col-span-12 md:col-span-8">
              <LiveGraphToken token={token.chain?.code} />
              <div className="hidden md:grid grid-cols-8 gap-4">
                <div className="col-span-12 md:col-span-3">
                  <PoolInfoToken token={token} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <OrderBookToken token={token} />
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
                  status={statusOrder}
                  orders={orders}
                />
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <LiveGraphToken token={token.chain?.code} />
            {currentToken && compareToken && orders && (
              <OrderWidgetToken
                name1={currentToken?.chain.name as string}
                code1={currentToken?.chain.code as string}
                name2={compareToken?.chain.name as string}
                code2={compareToken?.chain.code as string}
                status={statusOrder}
                orders={orders}
              />
            )}
            <OrderBookToken token={token} />
            <PoolInfoToken token={token} />
          </div>
        </>
      )}
    </div>
  );
}