import { numberWithCommas } from "@/helpers/comma.helper";
import { getTokenOrderBooks } from "@/store/apps/token-order-books";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Order } from "@/types";
import { TokenOrderBook, TokenOrderBooks } from "@/types/token-order-books.type";
import { Token } from "@/types/token.type";
import { useEffect, useState } from "react";

export const OrderBookTokenUi: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const { status } = useAppSelector((state) => state.tokenOrderBooks);
  const [maxSum, setMaxSum] = useState(0);
  const [value, setValue] = useState<TokenOrderBooks>();
  useEffect(() => {
    orders && setValue({
      id: "1",
      sell: orders.filter(order => order.order_type === "sell").map(order => ({price: Number(order.single_price), size: Number(order.budget)})),
      buy: orders.filter(order => order.order_type === "buy").map(order => ({price: Number(order.single_price), size: Number(order.budget)}))
    })
  }, [])

  useEffect(() => {
    let sellSum: number = 0,
      buySum: number = 0;
    value?.sell?.forEach((item) => {
      sellSum += item.size;
    });
    value?.buy?.forEach((item) => {
      buySum += item.size;
    });
    setMaxSum(Math.max(sellSum, buySum));
  }, [value]);

  let sum: number;

  return (
    <div>
      {status === "loading" && "Loading..."}
      {status === "ok" && value && (
        <div className="p-4 flex gap-2">
          <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {[...(value?.sell ?? [])]
                ?.sort((a, b) => b.price - a.price)
                ?.map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className="text-red-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                    >
                      <div className="absolute w-full rounded-lg mt-2 mr-4">
                        <div
                          className="bg-red-400/20 h-6 rounded text-start flex items-center px-2 ml-auto"
                          style={{
                            width: `${(sum * 100) / maxSum}%`,
                          }}
                        ></div>
                      </div>
                      <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                        {numberWithCommas(item.price)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {item.size.toFixed(2)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {numberWithCommas(sum)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {[...(value?.buy ?? [])]
                ?.sort((a, b) => a.price - b.price)
                ?.map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className="text-green-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                    >
                      <div className="text-green-400 absolute w-full rounded-lg m-2 pr-4">
                        <div
                          className="bg-green-400/20 h-6 rounded text-start flex items-center px-2 mr-auto"
                          style={{
                            width: `${(sum * 100) / maxSum}%`,
                          }}
                        ></div>
                      </div>
                      <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                        {numberWithCommas(item.price)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {item.size.toFixed(2)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {numberWithCommas(sum)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
