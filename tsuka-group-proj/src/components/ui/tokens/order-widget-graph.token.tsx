import { DeleteConfirmToken } from "@/components/ui/my-order/delete-confirm.token";
import { EditOrDeleteToken } from "@/components/ui/my-order/edit-or-delete.token";
import { ChartBound } from "@/types/chart-bound.type";
import { OrderStatusEnum } from "@/types/token-order.type";
import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";

export interface OrderWidgetGraphProp {
  id: number;
  buy: boolean;
  value1: number;
  value2?: number;
  budget: number;
  bound: ChartBound;
  status: string;
  showPopupBg: boolean;
  setShowPopupBg: (a: any) => void;
  setShowEditOrderModal: (show: boolean, order_id:number) => void;
  setShowDeletedAlert: (a: any) => void;
}

export const OrderWidgetGraph: React.FC<OrderWidgetGraphProp> = ({
  id,
  buy,
  value1,
  value2,
  budget,
  bound: { min, max },
  status,
  showPopupBg,
  setShowPopupBg,
  setShowEditOrderModal,
  setShowDeletedAlert,
}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showConfirmDlg, setShowConfirmDlg] = useState<boolean>(false);

  useEffect(() => {
    if (showPopupBg == false) setShowPopup(false);
    setShowConfirmDlg(false);
  }, [showPopupBg]);

  useEffect(() => {
    if (showConfirmDlg == false) setShowPopupBg(false);
  }, [showConfirmDlg]);

  const percents = useMemo(() => {
    const range = max - min;
    const percent1 = ((value1 - min) / range) * 90 + 10;
    const percent2 = value2 ? ((value2 - min) / range) * 90 + 10 : undefined;
    return [percent1, percent2];
  }, [value1, value2, min, max]);

  const statusColor = status===OrderStatusEnum.ACTIVE?"text-custom-primary":"text-tsuka-100";

  return (
    <div className="mb-2">
      <div className="flex justify-between px-4 py-2 border border-b-0 border-tsuka-400 text-tsuka-50">
        <p>{buy ? "BUY" : "SELL"}</p>
        <div
          className={`relative ${statusColor} flex items-center gap-2 cursor-pointer`}
          onClick={status===OrderStatusEnum.ACTIVE?() => {
            setShowPopup(true);
            setShowPopupBg(true);
          }:()=>{}}
        >
          Edit <FiEdit />
          {showPopup && (
            <EditOrDeleteToken
              setShowPopupBg={setShowPopupBg}
              setShowEditOrderModal={()=>{
                setShowEditOrderModal(true, id);
              }}
              setShowConfirmDlg={setShowConfirmDlg}
            />
          )}
          {showConfirmDlg && (
            <DeleteConfirmToken
              setShowPopupBg={setShowPopupBg}
              setShowConfirmDlg={(show:boolean)=>{
                setShowConfirmDlg(show);
              }}
              deleteID={id}
              setShowDeletedAlert={setShowDeletedAlert}
            />
          )}
        </div>
      </div>
      <div className="border border-tsuka-400 text-tsuka-100">
        <div className="py-2 px-4 text-sm text-tsuka-100">
          <div className="mb-2 flex justify-between">
            <span className={buy ? "text-custom-green" : "text-custom-red"}>
              {value2 ? "Price range" : "Target price"}
            </span>
            <span>{`$${value1}${
              value2?.toLocaleString() ? " - $" + value2.toLocaleString() : ""
            }`}</span>
          </div>
          <div className="flex justify-between">
            <span>Budget</span>
            <span>${budget.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex mt-4">
          <div
            className={`${
              buy ? "from-custom-green/10" : "from-custom-red/10"
            } w-full h-10 bg-gradient-to-t to-transparent relative`}
          >
            {percents.map(
              (percent, index) =>
                percent && (
                  <div
                    key={index}
                    className={`${
                      buy ? "border-custom-green" : "border-custom-red"
                    } border-r-4 h-10 absolute ${
                      index === 0
                        ? `${
                            buy
                              ? "from-custom-green/30 bg-gradient-to-t"
                              : "from-custom-red/30 bg-gradient-to-t"
                          }`
                        : `bg-tsuka-500 ${
                            buy ? "from-custom-green/10" : "from-custom-red/10"
                          } bg-gradient-to-t`
                    }`}
                    style={
                      !percents[1]
                        ? { marginLeft: `${percent}%` }
                        : { width: `${percent}%` }
                    }
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
