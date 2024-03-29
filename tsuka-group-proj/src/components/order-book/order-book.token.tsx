import { Order } from "@/types";
import { Token } from "@/types/token.type";
import { useState } from "react";
import { FiltersButton } from "../ui/buttons/filters.button";
import { OrderBookTokenUi } from "./order-book-token.ui";
import { OrderHistoryBookTokenUi } from "../ui/tokens/order-history-book-token.ui";
import { HistoricalDexTrades } from "@/lib/token-activity-feed";
import { TokenPairOrders } from "@/lib/setups";

export interface OrderBookTokens {
  value: string;
  label: string;
}

export const OrderBookToken: React.FC<{
  orders: TokenPairOrders[];
  tokens?: OrderBookTokens[];
  dexTrades: Array<HistoricalDexTrades>;
}> = ({ orders, tokens, dexTrades }) => {
  const [selectedPath, setSelectedPath] = useState("order-book");

  const options = [
    {
      title: "Order Book",
      path: "order-book",
    },
    {
      title: "Activity",
      path: "order-book-history",
    },
  ];

  const orderComponent =
    selectedPath === "order-book" ? (
      <OrderBookTokenUi orders={orders} tokens={tokens as OrderBookTokens[]} />
    ) : (
      <OrderHistoryBookTokenUi dexTrades={dexTrades} />
    );

  return (
    <div className="px-2 mt-4 bg-tsuka-500 rounded-xl text-tsuka-100">
      <div className="flex items-center justify-start w-full px-2 pt-2 mb-2 border-b border-tsuka-400">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() =>
              setSelectedPath((prev) =>
                prev === "order-book" ? "order-book-history" : "order-book"
              )
            }
            className={`${
              path === selectedPath
                ? "border-b-2 border-accent"
                : "border-b-2 border-transparent"
            } py-4 xs:p-4 text-center whitespace-nowrap mx-2 text-base sm:text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        {/*
        <div className="ml-auto">
          <FiltersButton callback={() => console.log("filters button")} />
        </div>
          */}
      </div>
      {orderComponent && (
        <div className="overflow-x-scroll">{orderComponent}</div>
      )}
    </div>
  );
};
