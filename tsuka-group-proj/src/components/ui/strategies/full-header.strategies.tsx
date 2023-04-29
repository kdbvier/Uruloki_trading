import { getStrategyDetails } from "@/store/apps/strategy-details";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StrategyStatusEnum } from "@/types/strategy.type";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { MdArrowBack } from "react-icons/md";
import { DefaultButton } from "../buttons/default.button";

export interface FullHeaderStrategiesProps {
  strategyId: string;
}

export const FullHeaderStrategies: React.FC<FullHeaderStrategiesProps> = ({
  strategyId,
}) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.strategyDetails);

  useEffect(() => {
    dispatch(getStrategyDetails(strategyId));
  }, [dispatch, strategyId]);

  const statusTextColor = useMemo((): string => {
    switch (value?.status) {
      case StrategyStatusEnum.ACTIVE:
        return "text-green-400";

      case StrategyStatusEnum.CANCELLED:
        return "text-red-400";

      case StrategyStatusEnum.EXECUTED:
        return "text-blue-400";

      default:
        return "text-blue-400";
    }
  }, [value?.status]);

  return (
    <div className="w-full text-tsuka-300 flex items-start py-2 mb-4 flex-col md:items-center md:flex-row">
      <Link
        href="/strategies"
        className="text-xl p-2 rounded-full cursor-pointer"
      >
        <MdArrowBack />
      </Link>
      {status === "loading" && "Loading..."}
      {!value && "Strategy ID not found"}
      {status === "ok" && value && (
        <>
          <div className="flex w-full items-center justify-center">
            <div className="px-2 flex-1 flex-col">
              <p className="text-3xl">
                #{strategyId}
                <label className="text-tsuka-50 font-medium ml-3">
                  {value?.title}
                </label>
              </p>
              <div className="flex items-start mt-2 flex-col md:flex-row">
                <label className="text-xs whitespace-nowrap">
                  <label className={`${statusTextColor} text-xs`}>
                    {value?.status}
                  </label>
                </label>
                <label className="text-xs whitespace-nowrap md:ml-4">
                  Created on:{" "}
                  <label className="text-xs text-tsuka-50">
                    {value?.createdAt}
                  </label>
                </label>
              </div>
            </div>
            <div className="text-sm justify-end w-full max-w-xs">
              <DefaultButton
                label="Create an Order"
                callback={() => console.log("default click")}
                filled={true}
                Icon={FiPlusCircle}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
