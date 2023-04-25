import { userOrder } from "@/@fake-data/user-order.fake-data";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { DeletedAlertToken } from "@/components/ui/my-order/deleted-alert.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { OrderStatusEnum } from "@/types/token-order.type";
import { useState } from "react";
import { FiArrowDown, FiFilter, FiSearch } from "react-icons/fi";

export default function MyOrder() {
  const [openMode, setOpenMode] = useState<boolean>(true);
  const [showPopupBg, setShowPopupBg] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);

  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      {/* header */}
      <div className={`w-full flex justify-between items-center`}>
        <h1 className="hidden md:block text-[40px] leading-[52px] font-medium text-tsuka-50">
          My Orders
        </h1>
        <div className="w-full md:w-auto flex flex-wrap">
          <div className="w-full md:w-auto flex gap-1">
            <button
              className={`w-1/2 md:w-auto px-4 py-[11px] focus:outline-none ${
                openMode ? "bg-tsuka-500 text-primary" : "text-tsuka-300"
              } rounded-md text-sm`}
              onClick={() => setOpenMode(true)}
            >
              Open Orders
            </button>
            <button
              className={`w-1/2 md:w-auto ml-1 px-4 py-[11px] focus:outline-none ${
                !openMode ? "bg-tsuka-500 text-primary" : "text-tsuka-300"
              } rounded-md text-sm`}
              onClick={() => setOpenMode(false)}
            >
              Closed Orders
            </button>
          </div>
          <hr className="md:hidden w-full mt-3 mb-5 border-tsuka-500" />
          <div className="md:ml-4 flex w-full md:w-auto items-center gap-3">
            <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
              <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
              <input
                type="text"
                className="w-full md:w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300"
                placeholder="Find tokens..."
              />
            </div>
            <button
              type="button"
              onClick={() => console.log("clicked!")}
              className={`px-3 py-[11px] focus:outline-none bg-tsuka-500 text-tsuka-100 rounded-md text-sm flex items-center`}
            >
              <label className="mr-1 text-tsuka-200 text-base">
                <FiFilter />
              </label>
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="grid grid-cols-12 gap-x-5">
        {userOrder.map((order, idx) => {
          if (idx > 2)
            return (
              <div
                className={`${
                  showAll ? "" : "hidden md:block"
                } col-span-12 md:col-span-6 lg:col-span-4`}
                key={idx}
              >
                <OrderWidgetToken
                  name1={"ethereum"}
                  code1={"ETH"}
                  name2={"bitcoin"}
                  code2={"BTC"}
                  status={OrderStatusEnum.EXECUTED}
                  orders={order.orders}
                  showPopupBg={showPopupBg}
                  setShowPopupBg={setShowPopupBg}
                  setShowEditOrderModal={setShowEditOrderModal}
                  setShowDeletedAlert={setShowDeletedAlert}
                />
              </div>
            );
          return (
            <div className="col-span-12 md:col-span-6 lg:col-span-4" key={idx}>
              <OrderWidgetToken
                name1={"ethereum"}
                code1={"ETH"}
                name2={"bitcoin"}
                code2={"BTC"}
                status={OrderStatusEnum.ACTIVE}
                orders={order.orders}
                showPopupBg={showPopupBg}
                setShowPopupBg={setShowPopupBg}
                setShowEditOrderModal={setShowEditOrderModal}
                setShowDeletedAlert={setShowDeletedAlert}
              />
            </div>
          );
        })}
      </div>
      {!showAll && (
        <div className="mt-4 flex justify-center">
          <button
            className="md:hidden flex items-center text-custom-primary font-medium py-2 px-3 bg-tsuka-500 rounded-md"
            onClick={() => setShowAll(true)}
          >
            <FiArrowDown className="text-lg mr-1" />
            Show more
          </button>
        </div>
      )}
      {showPopupBg && (
        <div
          className="fixed left-0 top-0 z-30 bg-[rgba(255,255,255,0)] w-full h-screen"
          onClick={() => setShowPopupBg(false)}
        />
      )}
      {showEditOrderModal && (
        <EditOrderToken
          setShowPopupBg={setShowPopupBg}
          setShowEditOrderModal={setShowEditOrderModal}
        />
      )}
      {showDeletedAlert && (
        <DeletedAlertToken
          setShowPopupBg={setShowPopupBg}
          setShowDeletedAlert={setShowDeletedAlert}
        />
      )}
    </div>
  );
}
