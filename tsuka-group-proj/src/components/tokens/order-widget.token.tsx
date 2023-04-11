import { SingleOrder, TokenOrder } from "@/types/token-order.type";
import { useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";
import { OrderWidgetGraph } from "../ui/tokens/order-widget-graph.token";

export const OrderWidgetToken: React.FC<TokenOrder> = ({
  name1,
  code1,
  name2,
  code2,
  orders,
}) => {
  function isSingle(object: any): object is SingleOrder {
    return "price" in object;
  }

  const chartBound = useMemo(() => {
    let values: Array<number> = [];

    orders?.map((item) => {
      if (isSingle(item)) {
        values.push(item.price);
        return;
      } else {
        item.prices.map((i) => values.push(i));
      }
    });

    const max = Math.max(...values) * 1.1;
    const min = Math.min(...values) * 0.9;
    return { min, max };
  }, [orders]);

  return (
    <div>
      <DefaultButton
        label="Create an Order"
        callback={() => console.log("default click")}
        filled={true}
        Icon={FiPlusCircle}
      />
      <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-6">
        <div className="flex flex-row items-center mb-4">
          <HorizontalIconsToken
            inputToken={{ code: code1, name: name1 }}
            outputToken={{ code: code2, name: name2 }}
          />
          <div className="px-2 flex-1 flex-col">
            <p className="text-sm">
              <label className="text-tsuka-50 text-base font-semibold">
                {code1}
              </label>
              /{code2}
            </p>
            <label className="text-xs">
              ID: {name1}/{name2}
            </label>
          </div>
          <div className="text-sm text-end">
            <div className="text-tsuka-200 text-xs">Status</div>
            <div className={`${true ? "text-green-400" : "text-red-400"}`}>
              <li>Active</li>
            </div>
          </div>
        </div>
        {orders?.map((order) => {
          if (isSingle(order)) {
            return (
              <OrderWidgetGraph
                key={order.id}
                buy={order.order_type === "buy"}
                value1={order.price}
                bound={chartBound}
              />
            );
          } else {
            return (
              <OrderWidgetGraph
                key={order.id}
                buy={order.order_type === "buy"}
                value1={order.prices[0]}
                value2={order.prices[1]}
                bound={chartBound}
              />
            );
          }
        })}
      </div>

      <DefaultButton
        label="Manage"
        callback={() => console.log("default click")}
      />
    </div>
  );
};
