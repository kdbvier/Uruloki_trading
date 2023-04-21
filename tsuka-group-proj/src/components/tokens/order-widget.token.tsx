import { ChartBound } from "@/types/chart-bound.type";
import {
  OrderStatusEnum,
  SingleOrder,
  TokenOrder,
} from "@/types/token-order.type";
import { useMemo } from "react";
import { DefaultButton } from "../ui/buttons/default.button";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { OrderWidgetGraph } from "../ui/tokens/order-widget-graph.token";
import { useState, useEffect } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";

export const OrderWidgetToken: React.FC<TokenOrder> = ({
  name1,
  code1,
  name2,
  code2,
  status,
  orders,
  showPopupBg = false,
  setShowPopupBg = () => {},
  setShowEditOrderModal = () => {},
  setShowDeletedAlert = () => {},
}) => {
  function isSingle(object: any): object is SingleOrder {
    return "price" in object;
  }

  const chartBound = useMemo((): ChartBound => {
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

  const statusColor = useMemo((): string => {
    switch (status) {
      case OrderStatusEnum.ACTIVE:
        return "green";

      case OrderStatusEnum.CANCELLED:
        return "red";

      case OrderStatusEnum.EXECUTED:
        return "blue";

      default:
        return "blue";
    }
  }, [status]);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showConfirmDlg, setShowConfirmDlg] = useState<boolean>(false);

  useEffect(() => {
    if (showPopupBg == false)
      setShowPopup(false);
      setShowConfirmDlg(false);
  }, [showPopupBg]);

  const manageHandler = (event: any) => {
    setShowPopup(true);
    setShowPopupBg(true);
  }

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-4 md:pt-6">
      <div className="flex flex-row items-center mb-4">
        <TokenIconsToken name={name1} shortName={code1} width={32} height={32} />
        <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={32} height={32} />
        <div className="px-2 flex-1 flex-col">
          <p className="text-tsuka-50 text-lg font-semibold">
            {code1}/{code2}
          </p>
          <label className="text-sm text-tsuka-200">ID: {name1}/{name2}</label>
        </div>
        <div className="text-end">
          <div className="text-tsuka-200 text-sm">Status</div>
          <div className="flex items-center font-medium">
            <div className={`w-1 h-1 mr-1 rounded-full bg-${statusColor}`}></div>
            <span className={`text-${statusColor}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
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
              budget={order.budget}
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
              budget={order.budget}
              bound={chartBound}
            />
          );
        }
      })}
      <div className="relative flex justify-center">
        <button className="text-primary font-medium" onClick={(e) => {manageHandler(e)}}>Manage</button>
        {
          showPopup &&
          <div className="absolute z-40 top-full w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]">
            <div
              className="flex justify-between items-center text-tsuka-50 text-lg cursor-pointer"
              onClick={() => {setShowPopupBg(false); setShowEditOrderModal(true);}}
            >
              <span>Edit</span>
              <FiEdit2 className="text-tsuka-300" />
            </div>
            <hr className="my-3 border-tsuka-400" />
            <div
              className="flex justify-between items-center text-red text-lg cursor-pointer"
              onClick={() => {setShowConfirmDlg(true);}}
            >
              <span>Delete</span>
              <FiTrash />
            </div>
          </div>
        }
        {
          showConfirmDlg &&
          <div className="absolute z-40 top-full w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]">
            <p className="text-center text-tsuka-50 text-lg font-medium">Are you sure?</p>
            <hr className="my-3 border-tsuka-400" />
            <div
              className="py-[11px] text-primary text-lg text-center bg-tsuka-400 rounded-md cursor-pointer"
              onClick={() => {setShowPopupBg(false); setShowConfirmDlg(false);}}
            >
              No, Cancel
            </div>
            <div
              className="mt-2 py-[11px] text-red text-lg text-center bg-tsuka-400 rounded-md cursor-pointer"
              onClick={() => {setShowPopupBg(false); setShowConfirmDlg(false); setShowDeletedAlert(true)}}
            >
              Yes, Delete
            </div>
          </div>
        }
      </div>
    </div>
  );
};
