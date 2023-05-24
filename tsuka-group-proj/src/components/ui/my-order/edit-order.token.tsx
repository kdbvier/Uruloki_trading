import {
  Order,
  PostOrder,
  TokenCache,
  TokenPairInfo,
  TokenPriceInPair,
} from "@/types";
// import getTokenCache from '@/lib/api/tokens/'
import { useEffect, useMemo, useState } from "react";
import Dropdown from "../buttons/dropdown";

// import {
//   editUserOrder,
//   setSelectedOrder,
//   createOrder,
//   getTokenPriceInPair,
// } from "@/store/apps/user-order";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PatchOrder } from "@/types";
import { OrderTypeEnum, PriceTypeEnum } from "@/types/token-order.type";

import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";
// import { getAllTokenCache } from "@/store/apps/token-cache";
import { FaClock, FaSync } from "react-icons/fa";
import { FiPlusCircle, FiX } from "react-icons/fi";
import ToggleButton from "../buttons/toggle.button";
import Orders from "@/lib/api/orders";
import HomePageTokens from "@/lib/api/tokens";
import { useUrulokiAPI } from "@/blockchain";
import { toast } from "react-toastify";
import { getConnectedAddress } from "@/helpers/web3Modal";

export interface EditOrderTokenProp {
  isEdit?: boolean;
  setShowEditOrderModal: (a: any) => void;
  name1?: string;
  code1?: string;
  name2?: string;
  code2?: string;
  pair_address?: string;
  quoteTokenPrice: number;
  selectedOrderId?: number;
  closeHandler: () => void;
  pairInfo?: TokenPairInfo;
  fetchOrders?: () => void;

  //  token?: Token;
}

export const convertLawPrice = (price: number) => {
  let priceEle;
  if (price >= 0.01) {
    priceEle = `$${commafy(price)}`;
  } else {
    priceEle = (
      <>
        {formatNumberToHtmlTag(price).integerPart}
        .0
        <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
        {formatNumberToHtmlTag(price).remainingDecimal}
      </>
    );
  }
  return priceEle;
};

export const handleNumberFormat = (num: number): string => {
  let value = num.toString();
  const pattern = /^\d*\.?\d*$/;
  if (!pattern.test(value)) return "";
  let newValue = "";
  if (value.search("\\.") !== -1) {
    let [integerPart, decimalPart] = value.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
    // const newValue = decimalPart ? `${integerPart}.${decimalPart}` : `${integerPart}.`;
  } else {
    newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return newValue;
};
const toNumber = (str: string): number => {
  const value = str.replace(/,/g, "");
  const num = Number(value);
  if (Number.isNaN(num)) {
    return -1;
  }
  return num;
};
export const EditOrderToken: React.FC<EditOrderTokenProp> = ({
  isEdit = true,
  setShowEditOrderModal,
  selectedOrderId = 0,
  closeHandler,
  fetchOrders,
  name1,
  code1,
  name2,
  code2,
  quoteTokenPrice,
  pair_address,
  pairInfo,
}) => {
  console.log("Create an order");
  // const dispatch = useAppDispatch();

  const [selectedOrder, setSelectedOrder_L] = useState<Order>({} as Order);
  const [tokenCache, setTokenCache] = useState<TokenCache[]>([]);
  const [token_price, setToken_Price] = useState<number>(0);
  // const selectedOrder = useAppSelector(
  //   (state) => state.userOrder.selectedOrder
  // );
  // const tokenCache = useAppSelector((state) => state.tokencache.value);
  // const token_price = useAppSelector(
  //   (state) => state.userOrder.selectedTokenPriceInPair
  // );
  const [seletCollaped, setSeletCollaped] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [allTokenName, setAllTokenName] = useState<TokenCache[]>([]);
  const [token1Symbol, settoken1Symbol] = useState("");
  const [token2Symbol, settoken2Symbol] = useState("");
  const [isBuy, setIsBuy] = useState(
    selectedOrder.order_type === OrderTypeEnum.BUY
  );
  const [targetPrice, setTargetPrice] = useState(
    handleNumberFormat(selectedOrder.single_price ?? 0)
  );
  const [minPrice, setMinPrice] = useState(
    handleNumberFormat(selectedOrder.from_price ?? 0)
  );
  const [maxPrice, setMaxPrice] = useState(
    handleNumberFormat(selectedOrder.to_price ?? 0)
  );
  const [amount, setAmount] = useState(
    handleNumberFormat(selectedOrder.budget ?? 0)
  );
  const [isRange, setIsRange] = useState(
    selectedOrder.price_type === PriceTypeEnum.RANGE
  );
  const [isContinuous, setIsContinuous] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  const [basePrice, setBasePrice] = useState<number>(0);

  const baseLongName = isEdit ? selectedOrder.baseTokenLongName : name1;
  const baseShortName = isEdit ? selectedOrder.baseTokenShortName : code1;
  const pairLongName = isEdit ? selectedOrder.pairTokenLongName : name2;
  const pairShortName = isEdit ? selectedOrder.pairTokenShortName : code2;

  const [tokenPairInfo, setTokenPairInfo] = useState<TokenPairInfo>();

  const {
    editContinuousPriceRangeOrder,
    editContinuousTargetPriceOrder,
    editNonContinuousPriceRangeOrder,
    editNonContinuousTargetPriceOrder,
    createContinuousPriceRangeOrder,
    createContinuousTargetPriceOrder,
    createNonContinuousPriceRangeOrder,
    createNonContinuousTargetPriceOrder,
  } = useUrulokiAPI();

  const getWalletAddress = async () => {
    let address = await getConnectedAddress();
    setWalletAddress(address);
  };

  useEffect(() => {
    if (isEdit) {
      // dispatch(setSelectedOrder(selectedOrderId));
      if (selectedOrderId == -1) {
        setSelectedOrder_L({} as Order);
      } else {
        Orders.getOrderById(selectedOrderId)
          .then((res) => {
            setSelectedOrder_L(res);
          })
          .catch((err) => console.error(err));
      }
    } else {
      // dispatch(getTokenPriceInPair(pair_address as string));
      Orders.getTokenPriceInPair(pair_address as string)
        .then((res) => {
          setToken_Price(res);
        })
        .catch((err) => console.error(err));
    }
    // dispatch(getAllTokenCache());
    getWalletAddress();
    Orders.getTokenPriceInPair(pair_address as string).then(res => setAmount(handleNumberFormat(selectedOrder.budget ? res * selectedOrder.budget : 0)))
  }, []);

  useEffect(() => {
    const currentToken: any = isBuy ? pairShortName : baseShortName;
    if (isBuy) settoken1Symbol(currentToken);
    else settoken2Symbol(currentToken);
    currentToken &&
      setAllTokenName([
        { shortName: currentToken } as TokenCache,
        ...tokenCache.filter(({ shortName }) => shortName !== currentToken),
      ]);
  }, [tokenCache, isBuy, pairShortName, baseShortName]);

  useEffect(() => {
    const currentToken = isBuy ? pairShortName : baseShortName;

    if (tokenCache && currentToken) {
      const currentPrice = tokenCache.filter(
        (token) => token.shortName === pairShortName
      ).length
        ? tokenCache.filter((token) => token.shortName === pairShortName)[0]!
            .price
        : 0;

      const selectPrice = tokenCache.filter((token) =>
        isBuy
          ? token.shortName === pairShortName
          : token.shortName === baseShortName
      ).length
        ? tokenCache.filter((token) =>
            isBuy
              ? token.shortName === pairShortName
              : token.shortName === baseShortName
          )[0]!.price
        : 0;
      const newValue = (
        Number(selectedOrder.budget) * Number(currentPrice / selectPrice)
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setAmount(newValue);
    }
  }, [isBuy]);

  useEffect(() => {
    const currentToken = isBuy ? pairShortName : baseShortName;

    if (tokenCache && currentToken) {
      const currentPrice = tokenCache.filter(
        (token) => token.shortName === pairShortName
      ).length ? tokenCache.filter(
        (token) => token.shortName === pairShortName
      )[0]!.price : 0;
      
      const selectPrice = tokenCache.filter((token) =>
        isBuy
          ? token.shortName === pairShortName
          : token.shortName === baseShortName
      ).length ?  tokenCache.filter((token) =>
      isBuy
        ? token.shortName === pairShortName
        : token.shortName === baseShortName
    )[0]!.price : 0;
      const newValue = (
        Number(selectedOrder.budget) * Number(currentPrice / selectPrice)
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setAmount(newValue);
    }
  }, [isBuy])

  useEffect(() => {
    if (JSON.stringify(selectedOrder) !== "{}" && isEdit) {
      setTargetPrice(handleNumberFormat(selectedOrder.single_price ?? 0));
      setMinPrice(handleNumberFormat(selectedOrder.from_price ?? 0));
      setMaxPrice(handleNumberFormat(selectedOrder.to_price ?? 0));
      setAmount(handleNumberFormat(selectedOrder.budget ?? 0));
      setIsRange(selectedOrder.price_type === PriceTypeEnum.RANGE);
      setIsContinuous(selectedOrder.is_continuous ?? false);
      // dispatch(getTokenPriceInPair(selectedOrder.pair_address as string));
      Orders.getTokenPriceInPair(selectedOrder.pair_address as string)
        .then((res) => {
          setToken_Price(res);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedOrder]);

  useEffect(() => {
    if ((token1Symbol || token2Symbol) && tokenCache.length) {
      const currentToken = isBuy ? pairShortName : baseShortName;
      const currentPrice = tokenCache.filter(
        (token) => token.shortName === currentToken
      ).length
        ? tokenCache.filter((token) => token.shortName === currentToken)[0]!
            .price
        : 0;
      const selectPrice = tokenCache.filter((token) =>
        isBuy
          ? token.shortName === token1Symbol
          : token.shortName === token2Symbol
      ).length
        ? tokenCache.filter((token) =>
            isBuy
              ? token.shortName === token1Symbol
              : token.shortName === token2Symbol
          )[0]!.price
        : 0;
      const newValue = (
        Number(selectedOrder.budget) * Number(currentPrice / selectPrice)
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setAmount(newValue);
    }
  }, [token1Symbol, token2Symbol]);

  const closeClickHandler = () => {
    closeHandler();
    setTargetPrice(handleNumberFormat(-1));
    setMinPrice(handleNumberFormat(-1));
    setMaxPrice(handleNumberFormat(-1));
    setAmount(handleNumberFormat(-1));
    setIsContinuous(false);
    setShowEditOrderModal(false);
  };
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

  const handleNumberInputChange = (name: string, event: any) => {
    let value = event.target.value.replace(/,/g, "");
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

  const toggle = () => {
    setIsContinuous((prevState) => !prevState);
  };
  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }
    if (isEdit) {
      const patchData = {} as PatchOrder;
      patchData.budget = toNumber(amount);
      patchData.order_type = isBuy ? "buy" : "sell";
      patchData.price_type = isRange ? "range" : "single";
      if (!isRange) {
        patchData.from_price = toNumber(minPrice);
        patchData.to_price = toNumber(maxPrice);
      } else {
        patchData.single_price = toNumber(targetPrice);
      }
      patchData.pairTokenShortName = token1Symbol
        ? (token1Symbol as string)
        : (selectedOrder.pairTokenShortName as string);
      patchData.baseTokenShortName = token2Symbol
        ? (token2Symbol as string)
        : (selectedOrder.baseTokenShortName as string);
      patchData.is_continuous = isContinuous;
      patchData.creator_address = walletAddress as string;
      console.log("before submit(patch)::");
      console.log(patchData);
      Orders.editOrder(selectedOrderId, patchData)
        .then((res) => {
          //TOAST:
          if (fetchOrders) {
            fetchOrders();
          }
          const payload = res as Order;
          if (payload.price_type === "range") {
            if (payload.is_continuous === true) {
              editContinuousPriceRangeOrder(
                payload.order_id,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              editNonContinuousPriceRangeOrder(
                payload.order_id,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          } else {
            if (payload.is_continuous === true) {
              editContinuousTargetPriceOrder(
                payload.order_id,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              console.log("--------------------------------");
              console.log(payload.order_id);
              console.log(tokenPairInfo?.pairedToken?.address as string);
              console.log(tokenPairInfo?.baseToken?.address as string);
              console.log(isBuy);
              console.log(Number(targetPrice.split(",").join("")));
              console.log(Number(amount.split(",").join("")));
              console.log("--------------------------------");
              editNonContinuousTargetPriceOrder(
                payload.order_id as number,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy as boolean,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          }
          alert("Order successfully updated");
          setShowEditOrderModal(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Update order failed");
          setShowEditOrderModal(false);
        });
      // dispatch(editUserOrder({ id: selectedOrderId, patchData }));
      // setShowEditOrderModal(false);
    } else {
      const postData = {} as PostOrder;
      postData.budget = toNumber(amount);
      postData.order_type = isBuy ? "buy" : "sell";
      postData.price_type = isRange ? "range" : "single";
      if (!isRange) {
        postData.from_price = toNumber(minPrice);
        postData.to_price = toNumber(maxPrice);
      } else {
        postData.single_price = toNumber(targetPrice);
      }
      postData.is_continuous = isContinuous;
      postData.baseTokenLongName = name1 as string;
      postData.baseTokenShortName = token2Symbol as string;
      postData.pairTokenLongName = name2 as string;
      postData.pairTokenShortName = token1Symbol as string;
      postData.user_id = 1; ////TODO:get it from server
      postData.pair_address = pair_address as string;
      postData.creator_address = walletAddress as string;
      console.log("before Submit(post)::");
      console.log(postData);
      Orders.createOrder(postData)
        .then((res) => {
          //TOAST:
          if (fetchOrders) {
            fetchOrders();
          }
          const payload = res as Order;
          if (payload.price_type === "range") {
            if (payload.is_continuous === true) {
              createContinuousPriceRangeOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              createNonContinuousPriceRangeOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          } else {
            if (payload.is_continuous === true) {
              createContinuousTargetPriceOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              createNonContinuousTargetPriceOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          }

          alert("Order successfully created");
          setShowEditOrderModal(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Create order failed");
          setShowEditOrderModal(false);
        });
      // dispatch(createOrder(postData));
      // setShowEditOrderModal(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 z-30 bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px] w-full h-screen">
      <div className="w-full h-full flex justify-center items-center p-4 md:p-0">
        <div className="relative w-full md:w-[440px] bg-tsuka-500 border rounded-2xl border-[#343C4F] text-tsuka-50 p-6">
          <FiX
            className="absolute top-3 right-3 text-tsuka-300 text-lg cursor-pointer"
            onClick={closeClickHandler}
          />
          <p className="text-2xl font-medium">
            {isEdit ? "Edit Order" : "Create an Order"}
          </p>
          <p className="text-sm">
            <span className="text-tsuka-200">Current Price : </span>
            <span className="text-tsuka-50">
              {!!token_price && (
                <>
                  $
                  {token_price >= 0.01
                    ? handleNumberFormat(
                        parseFloat(token_price.toFixed(2))
                      )
                    : convertLawPrice(token_price)}
                </>
              )}
            </span>
          </p>
          {/* <div className="w-full mt-4 flex gap-2 text-sm">
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                isContinuous ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsContinuous(true)}
            >
              <span
                className={isContinuous ? "text-tsuka-50 flex items-center" : "text-tsuka-300 flex items-center"}
              >
                <FaSync className={isContinuous? "text-custom-green mr-1 xs:mr-2":"text-tsuka-300 mr-1 xs:mr-2"}/> CONTNUOUS
              </span>
            </button>
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                !isContinuous ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsContinuous(false)}
            >
              <span
                className={!isContinuous ? "text-tsuka-50 flex items-center" : "text-tsuka-300 flex items-center"}
              >
                <FaClock className={!isContinuous?"text-custom-red mr-1 xs:mr-2":"text-tsuka-300 mr-1 xs:mr-2"}/>ONE TIME
              </span>
            </button>
          </div> */}
          <div className="flex flex-row-reverse justify-center items-center mt-4">
            <ToggleButton isContinuous={isContinuous} onToggle={toggle} />

            {isContinuous ? (
              <span
                className={
                  isContinuous
                    ? "text-tsuka-50 flex items-center"
                    : "text-tsuka-300 flex items-center"
                }
              >
                <FaSync
                  className={
                    isContinuous
                      ? "text-custom-green mr-1 xs:mr-2"
                      : "text-tsuka-300 mr-1 xs:mr-2"
                  }
                />{" "}
                Continuous
              </span>
            ) : (
              <span
                className={
                  !isContinuous
                    ? "text-tsuka-50 flex items-center"
                    : "text-tsuka-300 flex items-center"
                }
              >
                <FaClock
                  className={
                    !isContinuous
                      ? "text-custom-red mr-1 xs:mr-2"
                      : "text-tsuka-300 mr-1 xs:mr-2"
                  }
                />
                One time
              </span>
            )}
          </div>
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
              <p className="text-xs">
                {baseShortName} with {pairShortName}
              </p>
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
              <p className="text-xs">
                {baseShortName} for {pairShortName}
              </p>
            </button>
          </div>

          <div className="w-full mt-4 flex gap-2 text-sm">
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                !isRange ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsRange(false)}
            >
              <div
                className={`w-3 h-3 mr-2 border-solid border-[2px] rounded-full border-${
                  !isRange ? "primary" : "tsuka-300"
                }`}
              />
              <span className={!isRange ? "text-tsuka-50" : "text-tsuka-300"}>
                Price Range
              </span>
            </button>
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                isRange ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsRange(true)}
            >
              <div
                className={`w-3 h-3 mr-2 border-solid border-[4px] rounded-full border-${
                  isRange ? "primary" : "tsuka-300"
                }`}
              />
              <span className={isRange ? "text-tsuka-50" : "text-tsuka-300"}>
                Single Price
              </span>
            </button>
          </div>
          {isRange && (
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
          )}
          {!isRange && (
            <div className="block md:flex justify-between items-center">
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                  From ($)
                </span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={minPrice}
                  onChange={(e) => handleNumberInputChange("min", e)}
                  onBlur={(e) => blurHandler("min", e)}
                />
              </div>
              <span className="hidden md:block mx-4 mt-4 text-tsuka-300">
                -
              </span>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                  To ($)
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
          )}
          {/* <div className="flex items-center"> */}
          {/* <span className="ml-1 text-sm text-tsuka-100 mr-2">
                    {isBuy
                      ? pairLongName
                      : baseLongName}
                  </span>
                </div>
              </div>
                      ? selectedOrder.pairTokenLongName
                      : selectedOrder.baseTokenLongName}
                  </span> */}
          {/* </div> */}
          <span className="text-tsuka-200 text-sm mt-3 ml-3.5 px-1 bg-tsuka-500">
            Amount
          </span>

          <div
            className="w-full -mt-2.5 py-[11px] px-3 border border-tsuka-400 rounded-md "
            onClick={() => setSeletCollaped(!seletCollaped)}
          >
            <div className="w-full flex justify-between">
              <Dropdown
                allTokenName={allTokenName}
                setSelectTokenName={isBuy ? settoken1Symbol : settoken2Symbol}
              />
              {/* <div
                className="relative shrink-0 w-28 flex justify-between items-center p-2 bg-tsuka-400 rounded-lg cursor-pointer"
                onClick={() => setSeletCollaped(!seletCollaped)}
              >
                
              </div> */}
              <input
                type="text"
                className="grow min-w-[100px] bg-tsuka-500 outline-none text-right text-2xl font-medium"
                value={amount}
                onChange={(e) => handleNumberInputChange("amount", e)}
                onBlur={(e) => blurHandler("amount", e)}
              />
            </div>
            <div className="w-full flex justify-between mt-1">
              <p className="text-sm">
                <span className="text-tsuka-200">Balance : </span>
                <span className="text-tsuka-50 uppercase">
                  {3.000493} {(isBuy ? pairShortName : baseShortName) ?? ""}
                </span>
                <span className="text-custom-primary text-xs"> MAX</span>
              </p>
              <span className="text-tsuka-50 text-sm">
                {(() => {
                   let totalAmount = isBuy ? quoteTokenPrice * parseFloat(amount.split(",").join("")) : token_price * parseFloat(amount.split(",").join(""));
                  return (
                    <>
                      $
                      {totalAmount
                        ? totalAmount >= 0.001
                          ? handleNumberFormat(
                              parseFloat(totalAmount.toFixed(3))
                            )
                          : convertLawPrice(totalAmount)
                        : 0}
                    </>
                  );
                })()}
              </span>
            </div>
          </div>
          <button
            className="w-full flex justify-center items-center rounded-[10px] bg-custom-primary py-2 mt-3 text-white"
            onClick={handleSubmit}
          >
            {isEdit ? (
              <>Apply Changes</>
            ) : (
              <>
                <FiPlusCircle className="mr-1" /> Create Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
