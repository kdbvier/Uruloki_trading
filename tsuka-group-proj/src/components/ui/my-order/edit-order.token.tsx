import { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiPlusCircle } from "react-icons/fi";
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
  const [selectedToken, setSelectedToken] = useState(0);
  const [isBuy, setIsBuy] = useState(true);
  const [targetPrice, setTargetPrice] = useState("25000");
  const [minPrice, setMinPrice] = useState("25000");
  const [maxPrice, setMaxPrice] = useState("35000");
  const [amount, setAmount] = useState("40000");
  const [isRange, setIsRange] = useState(false);

  const tokens = [
    {
      name: "bitcoin",
      code: "BTC",
      title: "Bitcoin"
    },
    {
      name: "ethereum",
      code: "ETH",
      title: "Ethereum"
    }
  ]

  const priceType = (event: any) => {
    if (event.target.value === "1")
      setIsRange(false);
    else
      setIsRange(true);
  }

  return (
    <div
      className="fixed left-0 top-0 z-30 bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px] w-full h-screen"
      onClick={() => setShowPopupBg(false)}
    >
      <div className="w-full h-full flex justify-center items-center p-4 md:p-0">
        <div className="relative w-full md:w-[440px] bg-tsuka-500 border rounded-2xl border-[#343C4F] text-tsuka-50 p-6">
          <FiX
            className="absolute top-3 right-3 text-tsuka-300 text-lg cursor-pointer"
            onClick={() => setShowEditOrderModal(false)}
          />
          <p className="text-2xl font-medium">Edit Order</p>
          <p className="text-sm">
            <span className="text-tsuka-200">Current Price : </span>
            <span className="text-tsuka-50">${"490,080.23"}</span>
          </p>
          <div className="w-full mt-4 flex">
            <button
              className={`${isBuy ? "text-primary border-primary" : "text-tsuka-300 border-tsuka-300"} w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(true)}
            >
              <p className="font-medium">Buy</p>
              <p className="text-xs">BLUR with WETH</p>
            </button>
            <button
              className={`${!isBuy ? "text-primary border-primary" : "text-tsuka-300 border-tsuka-300"} w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(false)}
            >
              <p className="font-medium">SELL</p>
              <p className="text-xs">BLUR with WETH</p>
            </button>
          </div>
          <div className="w-full mt-4 flex gap-2 text-sm">
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${isRange ? "bg-tsuka-400" : ""}`}
              onClick={() => setIsRange(true)}
            >
              <div className={`w-3 h-3 mr-2 border-solid border-[2px] rounded-full border-${isRange ? "primary" : "tsuka-300"}`} />
              <span className={isRange ? "text-tsuka-50" : "text-tsuka-300"}>Price Range</span>
            </button>
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${!isRange ? "bg-tsuka-400" : ""}`}
              onClick={() => setIsRange(false)}
            >
              <div className={`w-3 h-3 mr-2 border-solid border-[4px] rounded-full border-${!isRange ? "primary" : "tsuka-300"}`} />
              <span className={!isRange ? "text-tsuka-50" : "text-tsuka-300"}>Single Price</span>
            </button>
          </div>
          {
            !isRange &&
            <div className="relative mt-4">
              <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">Target</span>
              <input
                type="number"
                className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
          }
          {
            isRange &&
            <>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">Min price</span>
                <input
                  type="number"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">Max price</span>
                <input
                  type="number"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </>
          }
          <div className="w-full mt-4 py-[11px] px-3 border border-tsuka-400 rounded-md">
            <div className="w-full flex justify-between">
              <div
                className="relative shrink-0 w-28 flex justify-between items-center p-2 bg-tsuka-400 rounded-lg cursor-pointer"
                onClick={() => setSeletCollaped(!seletCollaped)}
              >
                <div className="flex items-center">
                  <TokenIconsToken
                    name={tokens[selectedToken].name}
                    shortName={tokens[selectedToken].code}
                    width={16}
                    height={16}
                  />
                  <span className="ml-1 text-sm text-tsuka-100 mr-2">{tokens[selectedToken].title}</span>
                </div>
                {/* <FiChevronDown className=" text-tsuka-300 text-2xl" />
                {
                  !seletCollaped &&
                  <div className="absolute w-[90%] top-full left-[5%] right-[5%] shadow-gray-900 shadow-sm">
                    {
                      tokens.map((token, idx) => {
                        return (
                          <div
                            className={`flex items-center px-4 py-1 border-t border-tsuka-500 bg-tsuka-400 hover:bg-tsuka-300 ${
                              idx === tokens.length - 1 ? "rounded-b-md" : ""
                            }`}
                            key={idx}
                            onClick={() => {setSelectedToken(idx); setSeletCollaped(false);}}
                          >
                            <TokenIconsToken
                              className="shrink-0"
                              name={tokens[idx].name}
                              shortName={tokens[idx].code}
                              width={16}
                              height={16}
                            />
                            <span className="ml-1 text-sm text-tsuka-100 mr-2">{tokens[idx].title}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                } */}
              </div>
              <input
                type="number"
                className="grow min-w-[100px] bg-tsuka-500 outline-none text-right text-2xl font-medium"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-between mt-1">
              <p className="text-sm">
                <span className="text-tsuka-200">Amount : </span>
                <span className="text-tsuka-50">{3.000493} BTC</span>
                <span className="text-primary text-xs"> MAX</span>
              </p>
              <span className="text-tsuka-50 text-sm">${0}</span>
            </div>
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
