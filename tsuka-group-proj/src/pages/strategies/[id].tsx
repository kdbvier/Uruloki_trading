import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { FullHeaderStrategies } from "@/components/ui/strategies/full-header.strategies";
import { getStrategyDetails } from "@/store/apps/strategy-details";
import { getToken } from "@/store/apps/token";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function StrategyDetails({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id: strategyId = id || "" } = router.query;
  const {
    token: { value: token },
    strategyDetails: { value: strategyDetails },
  } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(getToken(strategyId as string));
  }, [dispatch, strategyId]);

  useEffect(() => {
    dispatch(getStrategyDetails(strategyId as string));
  }, [dispatch, strategyId]);

  return (
    <div className="flex flex-col">
      {strategyDetails && (
        <div className="p-8">
          <FullHeaderStrategies strategyId={strategyId as string} />
          <div className="grid grid-cols-9 gap-4">
            {strategyDetails?.orderTokens?.map((item, index) => (
              <div key={index} className="col-span-9 md:col-span-3">
                <OrderWidgetToken
                  name1={item.name1}
                  code1={item.code1}
                  name2={item.name2}
                  code2={item.code2}
                  status={item.status}
                  orders={item.orders}
                />
              </div>
            ))}
          </div>
          {token && <OrderBookToken token={token} />}
        </div>
      )}
    </div>
  );
}
