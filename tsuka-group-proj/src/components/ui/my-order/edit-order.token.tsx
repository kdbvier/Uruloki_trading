import { useState, useEffect } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";

export interface EditOrderTokenProp {
  setShowPopupBg: (a: any) => void;
  setShowEditOrderModal: (a: any) => void;
  name1: string;
  code1: string;
  name2: string;
  code2: string;
}

export const EditOrderToken: React.FC<EditOrderTokenProp> = ({
  setShowPopupBg,
  setShowEditOrderModal,
  name1,
  code1,
  name2,
  code2,
}) => {
  const [seletCollaped, setSeletCollaped] = useState(true);
  const [isBuy, setIsBuy] = useState(true);
  const [targetPrice, setTargetPrice] = useState("25000");
  const [amount, setAmount] = useState("40000");

  return (
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
            className="w-full mt-4 flex justify-between items-center border rounded-md border-tsuka-400 bg-tsuka-500 hover:bg-tsuka-400 py-[8px] px-3 cursor-pointer"
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
                <div className="w-full flex items-center px-4 py-1 border-b border-tsuka-300 bg-tsuka-500 hover:bg-tsuka-400">
                  <TokenIconsToken name={name1} shortName={code1} width={24} height={24} />
                  <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={24} height={24} />
                  <div className="px-2 flex flex-col">
                    <p className="text-tsuka-50 text-sm font-medium">
                      {code1}/{code2}
                    </p>
                    <label className="text-sm text-tsuka-300">ID: {name1}/{name2}</label>
                  </div>
                </div>
                <div className="w-full flex items-center px-4 py-1 border-b border-tsuka-300 bg-tsuka-500 hover:bg-tsuka-400">
                  <TokenIconsToken name={name1} shortName={code1} width={24} height={24} />
                  <TokenIconsToken className="-ml-1" name={name2} shortName={code2} width={24} height={24} />
                  <div className="px-2 flex flex-col">
                    <p className="text-tsuka-50 text-sm font-medium">
                      {code1}/{code2}
                    </p>
                    <label className="text-sm text-tsuka-300">ID: {name1}/{name2}</label>
                  </div>
                </div>
                <div className="w-full flex items-center px-4 py-1 border-b border-tsuka-300 bg-tsuka-500 hover:bg-tsuka-400">
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
              className={`${isBuy ? "text-primary border-primary" : "text-tsuka-300 border-tsuka-300"} w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(true)}
            >
              BUY
            </button>
            <button
              className={`${!isBuy ? "text-primary border-primary" : "text-tsuka-300 border-tsuka-300"} w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(false)}
            >
              SELL
            </button>
          </div>
          <select
            id="price-type"
            name="price-type"
            className="w-full mt-4 py-2 px-3 border border-tsuka-400 rounded-md text-tsuka-50 text-sm bg-tsuka-500 hover:bg-tsuka-400"
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
            <span className="text-green">{0.003059680}</span>
          </div>
          <button
            className="w-full rounded-[10px] bg-primary py-2 mt-3 text-white"
            onClick={() => {setShowEditOrderModal(false)}}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
