import React, { useState, useEffect } from "react";
import { OrderBookPosition } from "@/types/token-positions.type";
import { tokenPositionsData } from "@/@fake-data/token-positions.fake-data";
import { splitAddress } from "@/helpers/splitAddress.helper";
import { numberWithCommas } from "@/helpers/comma.helper";
import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";
import { HistoricalDexTrades } from "@/lib/token-activity-feed";

const subPrice = (price: number) => {
  let priceEle;
  if (price >= 0.01) {
    // console.log("topgainer price >: ", topGainer.price);
    priceEle = `$${price.toLocaleString("en-us")}`;
  } else {
    // console.log("topgainer price <: ", topGainer.price);

    priceEle = (
      <>
        ${formatNumberToHtmlTag(price).integerPart}.0
        <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
        {formatNumberToHtmlTag(price).remainingDecimal}
      </>
    );
  }
  return priceEle;
};
export interface OrderBookTokenProps {
  dexTrades: Array<HistoricalDexTrades>;
}

interface TradeRowProps {
  item: HistoricalDexTrades;
}

const TradeRow: React.FC<TradeRowProps> = ({ item }) => {
  return (
    <div
      className={`${
        item.side == "BUY" || item.side == "Buy"
          ? "text-green-400"
          : "text-red-400"
      } border-b border-tsuka-400 text-base relative w-full text-left flex flex-center`}
    >
      <span className=" py-2 w-[120px] ml-4 text-sm font-normal whitespace-nowrap">
        {item.side}
      </span>
      <span className=" py-2 w-[190px] text-sm font-normal whitespace-nowrap">
        {subPrice(Number(item.tradeAmount))}
      </span>
      <span className=" py-2  text-sm font-normal whitespace-nowrap">
        {item.transaction.txFrom.address}
      </span>
    </div>
  );
};

export const OrderHistoryBookTokenUi: React.FC<OrderBookTokenProps> = ({
  dexTrades,
}) => {
  return (
    <div>
      {/* {status === "loading" && "Loading..."}
      {status === "ok" && value && ( */}
      <div className="p-4 flex">
        <div className="flex-1">
          <div className="h-96 overflow-auto">
            <div className="text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
              <span className="px-4 py-2 w-[120px]">Type</span>
              <span className="px-4 py-2 w-[190px]">Amount (USD)</span>
              <span className="px-4 py-2">Buyer Address</span>
            </div>
            {dexTrades &&
              dexTrades.map((item: any, index: number) => (
                <TradeRow key={index} item={item} />
              ))}
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};
