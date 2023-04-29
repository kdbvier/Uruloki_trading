import { StrategyBookStrategies } from "@/components/strategies/strategy-book.strategies";
import { getStrategies } from "@/store/apps/strategies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function StrategyDetails() {
  const dispatch = useAppDispatch();
  const {
    strategies: { value: strategies },
  } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(getStrategies());
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      {strategies && (
        <div className="p-8">
          <div className="w-full gap-4 text-tsuka-300 flex py-2 mb-2 flex-col md:items-center md:flex-row">
            <p className="text-4xl text-tsuka-50">My Strategies</p>
            <p className="text-2xl">My Orders</p>
          </div>
          <StrategyBookStrategies strategies={strategies} />
        </div>
      )}
    </div>
  );
}
