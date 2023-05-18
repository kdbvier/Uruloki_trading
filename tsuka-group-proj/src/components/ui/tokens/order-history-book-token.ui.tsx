import React, { useState, useEffect } from "react";
import { OrderBookPosition } from "@/types/token-positions.type";
import { tokenPositionsData } from "@/@fake-data/token-positions.fake-data";
import { splitAddress } from "@/helpers/splitAddress.helper";
import { numberWithCommas } from "@/helpers/comma.helper";

export interface OrderBookTokenProps {
  token: {
    id: string;
    token: string;
  };
}

export const OrderHistoryBookTokenUi: React.FC<OrderBookTokenProps> = ({
  token,
}) => {
  const [status, setStatus] = useState<"ok" | "loading" | "failed">("loading");
  const [value, setValue] = useState<Array<OrderBookPosition>>([]);

  useEffect(() => {
    setStatus("loading");

    const fetchData = async () => {
      try {
        const data = tokenPositionsData.find((item) => item.id === token.id);
        if (!data) {
          throw new Error("No data found");
        }

        const filteredData = [
          ...data.buy.positions.map((item) => {
            return {
              ...item,
              address: splitAddress(item.address),
            };
          }),
          ...data.sell.positions.map((item) => {
            return {
              ...item,
              address: splitAddress(item.address),
            };
          }),
        ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

        setValue(filteredData);
        setStatus("ok");
      } catch (error) {
        console.error(error);
        setStatus("failed");
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      {status === "loading" && "Loading..."}
      {status === "ok" && value && (
        <div className="p-4 flex">
          <div className="flex-1">
            <div className="h-96 overflow-auto">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Type</span>
                <span className="flex-1 px-4 py-2">Price (USD)</span>
                <span className="flex-1 px-4 py-2">Amount {token.token}</span>
                <span className="flex-1 px-4 py-2">Buyer Address</span>
              </div>
              {value.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    item.type === "Buy" ? "text-green-400" : "text-red-400"
                  } border-b border-tsuka-400 text-base relative w-full text-left flex flex-center`}
                >
                  <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                    {item.type}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                    {numberWithCommas(item.priceUsdt)}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                    {item.amount}
                  </span>
                  <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                    {item.address}
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
