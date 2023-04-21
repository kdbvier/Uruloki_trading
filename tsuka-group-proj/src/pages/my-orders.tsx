import { FiFilter, FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import { useState, useEffect } from "react";
import { UserOrder, userOrder } from "@/@fake-data/user-order.fake-data";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import Image from "next/image";

export default function Home() {
  const [openMode, setOpenMode] = useState(true);
  const [showPopupBg, setShowPopupBg] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [seletCollaped, setSeletCollaped] = useState(true);
  const [isBuy, setIsBuy] = useState(true);
  const [targetPrice, setTargetPrice] = useState("25000");
  const [amount, setAmount] = useState("40000");
  const [showDeletedAlert, setShowDeletedAlert] = useState(false);

  const token = {
    id: "1",
    token: "ETH",
    icon: "/tokens/eth-icon.svg",
  };

  const name1 = "bitcoin";
  const code1 = "BTC";
  const name2 = "ethereum";
  const code2 = "ETH";

  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      {/* header */}
      <div className={`w-full flex justify-between items-center`}>
        <h1 className="hidden md:block text-[40px] leading-[52px] font-medium text-tsuka-50">My Orders</h1>
        <div className="w-full md:w-auto flex flex-wrap">
          <div className="w-full md:w-auto flex gap-1">
            <button
              className={`w-1/2 md:w-auto px-4 py-[11px] focus:outline-none ${openMode ? "bg-tsuka-500 text-[#AF71FF]" : "text-tsuka-300"} rounded-md text-sm`}
              onClick={() => setOpenMode(true)}
            >
              Open Orders
            </button>
            <button
              className={`w-1/2 md:w-auto ml-1 px-4 py-[11px] focus:outline-none ${!openMode ? "bg-tsuka-500 text-[#AF71FF]" : "text-tsuka-300"} rounded-md text-sm`}
              onClick={() => setOpenMode(false)}
            >
              Closed Orders
            </button>
          </div>
          <hr className="md:hidden w-full mt-3 mb-5 border-tsuka-500" />
          <div className="md:ml-4 flex w-full md:w-auto items-center gap-3">
            <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
              <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
              <input type="text" className="w-full md:w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300" placeholder="Find tokens..." />
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
        {
          userOrder.map((order, idx) => {
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
            )
          })
        }
      </div>
      {
        showPopupBg &&
        <div
          className="fixed left-0 top-0 z-30 bg-[rgba(255,255,255,0)] w-full h-screen"
          onClick={() => setShowPopupBg(false)}
        />
      }
      {
        showEditOrderModal &&
        <div
          className="fixed left-0 top-0 z-30 bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px] w-full h-screen"
          onClick={() => setShowPopupBg(false)}
        >
          <div className="w-full h-full flex justify-center items-center p-4 md:p-0">
            <div className="w-full md:w-[440px] bg-tsuka-500 border rounded-2xl border-[#343C4F] text-tsuka-50 p-6">
              <div className="flex justify-between">
                <span className="text-2xl font-medium">Edit Order</span>
                <FiX
                  className="text-tsuka-300 text-lg -mr-3 -mt-3 cursor-pointer"
                  onClick={() => setShowEditOrderModal(false)}
                />
              </div>
              <div
                className="w-full mt-4 flex justify-between items-center border rounded-md border-tsuka-400 bg-tsuka-500 py-[8px] px-3 cursor-pointer"
                onClick={() => setSeletCollaped(!seletCollaped)}
              >
                <div className="flex items-center">
                  <TokenIconsToken name={name1} shortName={code1} width={24} height={24} />
                  <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={24} height={24} />
                  <div className="px-2 flex flex-col">
                    <p className="text-tsuka-50 text-sm font-medium">
                      {code1}/{code2}
                    </p>
                    <label className="text-sm text-tsuka-300">ID: {name1}/{name2}</label>
                  </div>
                </div>
                <FiChevronDown className="text-tsuka-300" />
              </div>
              <div className="relative w-full">
                {
                  !seletCollaped &&
                  <div className="absolute z-50 w-full shadow-gray-900 shadow-lg">
                    <div className="w-full flex items-center px-4 py-1 border-b border-tsuka-300 bg-tsuka-500">
                      <TokenIconsToken name={name1} shortName={code1} width={24} height={24} />
                      <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={24} height={24} />
                      <div className="px-2 flex flex-col">
                        <p className="text-tsuka-50 text-sm font-medium">
                          {code1}/{code2}
                        </p>
                        <label className="text-sm text-tsuka-300">ID: {name1}/{name2}</label>
                      </div>
                    </div>
                    <div className="w-full flex items-center px-4 py-1 border-b border-tsuka-300 bg-tsuka-500">
                      <TokenIconsToken name={name1} shortName={code1} width={24} height={24} />
                      <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={24} height={24} />
                      <div className="px-2 flex flex-col">
                        <p className="text-tsuka-50 text-sm font-medium">
                          {code1}/{code2}
                        </p>
                        <label className="text-sm text-tsuka-300">ID: {name1}/{name2}</label>
                      </div>
                    </div>
                    <div className="w-full flex items-center px-4 py-1 border-b border-tsuka-300 bg-tsuka-500">
                      <TokenIconsToken name={name1} shortName={code1} width={24} height={24} />
                      <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={24} height={24} />
                      <div className="px-2 flex flex-col">
                        <p className="text-tsuka-50 text-sm font-medium">
                          {code1}/{code2}
                        </p>
                        <label className="text-sm text-tsuka-300">ID: {name1}/{name2}</label>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className="w-full mt-4 flex">
                <button
                  className={`${isBuy ? "text-[#AF71FF] border-[#AF71FF]" : "text-tsuka-300 border-tsuka-300"} w-1/2 border-b text-center py-[11px]`}
                  onClick={() => setIsBuy(true)}
                >
                  BUY
                </button>
                <button
                  className={`${!isBuy ? "text-[#AF71FF] border-[#AF71FF]" : "text-tsuka-300 border-tsuka-300"} w-1/2 border-b text-center py-[11px]`}
                  onClick={() => setIsBuy(false)}
                >
                  SELL
                </button>
              </div>
              <select
                id="price-type"
                name="price-type"
                className="w-full mt-4 py-2 px-3 border border-tsuka-400 rounded-md text-tsuka-50 text-sm bg-tsuka-500"
              >
                <option value="Limit Price">Limit Price</option>
                <option value="Limit Price">Limit Price</option>
                <option value="Limit Price">Limit Price</option>
              </select>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">Target</span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                />
              </div>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">Amount</span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-tsuka-200">Slippage</span>
                <span className="text-tsuka-50">{2.5}%</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-tsuka-200">Price for an tokens</span>
                <span className="text-[#6FCF97]">{0.003059680}</span>
              </div>
              <button
                className="w-full rounded-[10px] bg-[#AF71FF] py-2 mt-3 text-white"
                onClick={() => {setShowEditOrderModal(false)}}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      }
      {
        showDeletedAlert &&
        <div
          className="fixed left-0 bottom-0 z-30 bg-gradient-to-t from-[#13151F] to-transparent w-full py-4 lg:py-8 flex justify-center items-center"
          onClick={() => setShowPopupBg(false)}
        >
          <div
            className="relative bg-tsuka-500 rounded-2xl p-5 pr-7 flex items-center mx-4"
          >
            <Image src="/icons/alert.png" alt="alter" width={40} height={40} />
            <div className="ml-3">
              <p className="text-tsuka-100 text-lg">
                You just delete order <span className="text-tsuka-50">{"ANCH"} with {"PLKD"}</span>.
              </p>
              <p className="text-sm text-tsuka-200">
                Clicked by mistake? <span className="text-[#AF71FF] cursor-pointer" onClick={() => setShowDeletedAlert(false)}>undo</span>
              </p>
            </div>
            <FiX className="absolute top-3 right-3 text-tsuka-300 font-medium cursor-pointer" onClick={() => setShowDeletedAlert(false)} />
          </div>
        </div>
      }
    </div>
  );
}
