import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { commafy, unCommafy } from "@/helpers/calc.helper";
import { Token } from "@/types/token.type";
import { PostOrder } from "@/types";
import Orders from "@/lib/api/orders"
import { useEffect, useState } from "react";
import { FiX, FiPlusCircle } from "react-icons/fi";

export interface EditOrderTokenProp {
  isEdit?: boolean;
  setShowPopupBg: (a: any) => void;
  setShowEditOrderModal: (a: any) => void;
  token?: Token;
}

export const EditOrderToken: React.FC<EditOrderTokenProp> = ({
  isEdit = true,
  setShowPopupBg,
  setShowEditOrderModal,
  token,
}) => {
  const [seletCollaped, setSeletCollaped] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [isBuy, setIsBuy] = useState(true);
  const [targetPrice, setTargetPrice] = useState("25,000");
  const [minPrice, setMinPrice] = useState("25,000");
  const [maxPrice, setMaxPrice] = useState("35,000");
  const [amount, setAmount] = useState("40,000");
  const [isRange, setIsRange] = useState(true);

  const tokens = [
    {
      name: "bitcoin",
      code: "BTC",
      title: "Bitcoin",
    },
    {
      name: "ethereum",
      code: "ETH",
      title: "Ethereum",
    },
  ];

  useEffect(() => {
    setShowPopupBg(false);
  });

  const handleNumberInputChange = (name: string, event: any) => {
    const value = event.target.value.replace(/,/g, "");
    const pattern = /^\d*\.?\d*$/;
    if (!pattern.test(value)) return;
    let newValue = "";
    if (value.search("\\.") !== -1) {
      let [integerPart, decimalPart] = value.split(".");
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
      // const newValue = decimalPart ? `${integerPart}.${decimalPart}` : `${integerPart}.`;
    } else {
      newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    switch (name) {
      case "amount":
        setAmount(newValue);
        break;
      case "target":
        setTargetPrice(newValue);
        break;
      case "min":
        setMinPrice(newValue);
        break;
      case "max":
        setMaxPrice(newValue);
        break;

      default:
        break;
    }
  };

  const blurHandler = (name: string, event: any) => {
    let value = event.target.value.replace(/,/g, "");
    let newValue = "";
    if (!/^\d*\.?\d*$/.test(value)) {
      newValue = "0";
      return;
    } else {
      value = (+value).toString();
      let [integerPart, decimalPart] = value.split(".");
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      newValue = decimalPart
        ? `${integerPart}.${decimalPart}`
        : `${integerPart}`;
    }
    switch (name) {
      case "amount":
        setAmount(newValue);
        break;
      case "target":
        setTargetPrice(newValue);
        break;
      case "min":
        setMinPrice(newValue);
        break;
      case "max":
        setMaxPrice(newValue);
        break;

      default:
        break;
    }
  };

  const submit = async () => {
    setShowEditOrderModal(false);
    const data: PostOrder = {
      user_id: 1,
      pair_address: token?.pair?.address ? token?.pair?.address : "0x00",
      status: "Active",
      // token_price: unCommafy(token?.price.value),
      single_price: unCommafy(targetPrice),
      from_price: unCommafy(minPrice),
      to_price: unCommafy(maxPrice),
      budget: unCommafy(amount),
      order_type: isBuy ? "buy" : "sell",
      price_type: isRange ? "range" : "single",
    }
    console.log(data);
    try {
      let res = await Orders.createOrder(data);
      console.log(res);
    } catch (error) {
      console.log(error);      
    }
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
          <p className="text-2xl font-medium">{isEdit ? "Edit Order" : "Create an Order"}</p>
          <p className="text-sm">
            <span className="text-tsuka-200">Current Price : </span>
            <span className="text-tsuka-50">${"490,080.23"}</span>
          </p>
          <div className="w-full mt-4 flex">
            <button
              className={`${
                isBuy
                  ? "text-custom-primary border-custom-primary"
                  : "text-tsuka-300 border-tsuka-300"
              } w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(true)}
            >
              <p className="font-medium">Buy</p>
              <p className="text-xs">BLUR with WETH</p>
            </button>
            <button
              className={`${
                !isBuy
                  ? "text-custom-primary border-custom-primary"
                  : "text-tsuka-300 border-tsuka-300"
              } w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(false)}
            >
              <p className="font-medium">SELL</p>
              <p className="text-xs">BLUR for WETH</p>
            </button>
          </div>
          <div className="w-full mt-4 flex gap-2 text-sm">
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                isRange ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsRange(true)}
            >
              <div
                className={`w-3 h-3 mr-2 border-solid border-[2px] rounded-full border-${
                  isRange ? "primary" : "tsuka-300"
                }`}
              />
              <span className={isRange ? "text-tsuka-50" : "text-tsuka-300"}>
                Price Range
              </span>
            </button>
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                !isRange ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsRange(false)}
            >
              <div
                className={`w-3 h-3 mr-2 border-solid border-[4px] rounded-full border-${
                  !isRange ? "primary" : "tsuka-300"
                }`}
              />
              <span className={!isRange ? "text-tsuka-50" : "text-tsuka-300"}>
                Single Price
              </span>
            </button>
          </div>
          {
            !isRange &&
            <div className="relative mt-4">
              <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                Target ($)
              </span>
              <input
                type="text"
                className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                value={targetPrice}
                onChange={(e) => handleNumberInputChange("target", e)}
                onBlur={(e) => blurHandler("target", e)}
              />
            </div>
          }
          {
            isRange &&
            <div className="block md:flex justify-between items-center">
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">From ($)</span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={minPrice}
                  onChange={(e) => handleNumberInputChange("min", e)}
                  onBlur={(e) => blurHandler("min", e)}
                />
              </div>
              <span className="hidden md:block mx-4 mt-4 text-tsuka-300">-</span>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                  Max price ($)
                </span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={maxPrice}
                  onChange={(e) => handleNumberInputChange("max", e)}
                  onBlur={(e) => blurHandler("max", e)}
                />
              </div>
            </div>
          }
          <span className="text-tsuka-200 text-sm mt-3 ml-3.5 px-1 bg-tsuka-500">Amount</span>
          <div className="w-full -mt-2.5 py-[11px] px-3 border border-tsuka-400 rounded-md">
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
                  <span className="ml-1 text-sm text-tsuka-100 mr-2">
                    {tokens[selectedToken].title}
                  </span>
                </div>
              </div>
              <input
                type="text"
                className="grow min-w-[100px] bg-tsuka-500 outline-none text-right text-2xl font-medium"
                value={amount}
                onChange={(e) => handleNumberInputChange("amount", e)}
                onBlur={(e) => blurHandler("amount", e)}
              />
              {/* <p className="relative grow min-w-[100px] text-tsuka-50 bg-tsuka-500 outline-none text-right text-2xl font-medium">
                {commafy2(amount)}
                <input
                  type="number"
                  className="absolute w-full h-full left-0 top-0 text-tsuka-50 bg-tsuka-500/0 outline-none text-right text-2xl font-medium"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </p> */}
            </div>
            <div className="w-full flex justify-between mt-1">
              <p className="text-sm">
                <span className="text-tsuka-200">Balance : </span>
                <span className="text-tsuka-50">{3.000493} BTC</span>
                <span className="text-custom-primary text-xs"> MAX</span>
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
            <span className="text-custom-green">{0.00305968}</span>
          </div>
          <button
            className="w-full flex justify-center items-center rounded-[10px] bg-primary py-2 mt-3 text-white"
            onClick={submit}
          >
            {
              isEdit ? <>Apply Changes</> :
              <>
                <FiPlusCircle className="mr-1" /> Create Order
              </>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
