import { numberWithCommas } from "@/helpers/comma.helper";
import { getTokenPosition } from "@/store/apps/token-positions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export interface OrderBookTokenProps {
  token: {
    id: string;
    token: string;
  };
}

export const OrderBookTokenUi: React.FC<OrderBookTokenProps> = ({ token }) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.tokenPosition);

  useEffect(() => {
    dispatch(getTokenPosition(token.id));
  }, [dispatch, token]);

  return (
    <div>
      {status === "loading" && "Loading..."}
      {status === "ok" && value && (
        <div className="p-4 flex">
          <div className="flex-1">
            <div className="h-96 overflow-auto">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {value?.sell?.positions?.map((item, index) => (
                <div
                  key={index}
                  className="text-red-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                >
                  <div className="absolute w-full rounded-lg m-2 mr-4">
                    <div
                      className="bg-red-400/20 h-6 rounded text-start flex items-center px-2 ml-auto mr-4"
                      style={{
                        width: `${item.depth}%`,
                      }}
                    ></div>
                  </div>
                  <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                    {numberWithCommas(item.priceUsdt)}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                    {item.amount}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                    {numberWithCommas(value?.sell?.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2" />
          <div className="flex-1">
            <div className="h-96 overflow-auto">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {value?.buy?.positions?.map((item, index) => (
                <div
                  key={index}
                  className="text-green-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                >
                  <div className="absolute w-full rounded-lg m-2 mr-4">
                    <div
                      className="bg-green-400/20 h-6 rounded text-start flex items-center px-2 mr-auto"
                      style={{
                        width: `${item.depth}%`,
                      }}
                    ></div>
                  </div>
                  <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                    {numberWithCommas(item.priceUsdt)}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                    {item.amount}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                    {numberWithCommas(value?.buy?.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
