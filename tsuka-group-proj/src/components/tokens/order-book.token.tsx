import { getTokenPosition } from "@/store/apps/token-positions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { FiltersButton } from "../ui/buttons/filters.button";
import { OrderBookTokenUi } from "../ui/tokens/order-book-token.ui";
import { OrderHistoryBookTokenUi } from "../ui/tokens/order-history-book-token.ui";

export interface OrderBookTokenProps {
  token: {
    id: string;
    token: string;
    pair: {
      address: string;
    };
  };
}

export const OrderBookToken: React.FC<OrderBookTokenProps> = ({ token }) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.tokenPosition);
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

  const OrderComponent =
    selectedPath === "order-book" ? OrderBookTokenUi : OrderHistoryBookTokenUi;

  useEffect(() => {
    dispatch(getTokenPosition(token.id));
  }, [dispatch, token]);

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100">
      <div className="w-full flex items-center justify-start border-b border-tsuka-400 px-4 pt-2">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() =>
              setSelectedPath((prev) =>
                prev === "order-book" ? "order-book-history" : "order-book"
              )
            }
            className={`${
              path === selectedPath ? "border-b-2 border-accent" : ""
            } p-4 text-center mx-2 text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        <div className="ml-auto">
          <FiltersButton callback={() => console.log("filters button")} />
        </div>
      </div>
      {OrderComponent && <OrderComponent token={token} />}
    </div>
  );
};
