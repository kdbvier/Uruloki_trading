import {
  Order,
  PostOrder,
  TokenCache,
  TokenPairInfo,
  TokenPriceInPair,
} from "@/types";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { fetchBalance } from '@wagmi/core'
import Dropdown from "../buttons/dropdown";

import { OrderTypeEnum, PriceTypeEnum } from "@/types/token-order.type";
import HomePageTokens from "@/lib/api/tokens";
import { FaClock, FaSync } from "react-icons/fa";
import { FiPlusCircle, FiX } from "react-icons/fi";
import ToggleButton from "../buttons/toggle.button";
import Orders from "@/lib/api/orders";
import { useUrulokiAPI } from "@/blockchain";
import { toast } from "react-toastify";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { handleNumberFormat, convertLawPrice, toNumber, fixedDecimal, commafyOrHtmlTag } from "@/lib/number-helpers";
import { handleIsEditLoad } from "@/lib/edit-order-token/onLoad";
import {
  CreateOrderPriceInfoProps,
  createOrderInContract,
  createOrderInDb,
} from "@/lib/create-order-token/submit-order";
import {
  blurHandler,
  handleNumberInputChange,
} from "@/lib/edit-order-token/helpers";
import {
  CreateOrderPriceInfo,
  editOrderInContract,
  editOrderInDb,
} from "@/lib/edit-order-token/submit-order";

export interface EditOrderTokenProp {
  isEdit?: boolean;
  setShowEditOrderModal: (a: any) => void;
  name1?: string;
  code1?: string;
  name2?: string;
  code2?: string;
  pair_address?: string;
  pair_price_info?: TokenPriceInPair;
  selectedOrderId?: number;
  closeHandler: () => void;
  pairInfo?: TokenPairInfo;
  fetchOrders?: () => void;
}

export const EditOrderToken: React.FC<EditOrderTokenProp> = ({
  isEdit = true,
  setShowEditOrderModal,
  selectedOrderId,
  closeHandler,
  fetchOrders,
  name1,
  code1,
  name2,
  code2,
  pair_price_info,
  pair_address,
  pairInfo,
}) => {
  const [selectedOrder, setSelectedOrder_L] = useState<Order>({} as Order);
  const [tokenCache, setTokenCache] = useState<TokenCache[]>([]);
  const [tokenPairPriceInfo, setTokenPairPriceInfo] =
    useState<TokenPriceInPair>(
      pair_price_info ?? { base_price: 0, quote_price: 0 }
    );

  const [seletCollaped, setSeletCollaped] = useState(true);
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
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>();

  const baseShortName = isEdit ? selectedOrder.baseTokenShortName : code1;
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
    if (isEdit && selectedOrderId) {
      handleIsEditLoad(
        selectedOrderId ?? 0,
        setSelectedOrder_L,
        setTokenPairPriceInfo,
        setAmount
      );
    }
    if (!pairInfo) {
      void (async () => {
        const info = await HomePageTokens.getTokenPairInfo(
          pair_address as string
        );
        setTokenPairInfo(info);
      })();
    } else {
      setTokenPairInfo(pairInfo);
    }
    getWalletAddress();
  }, []);

  useEffect(() => {
    (async() => {
      if(walletAddress && tokenPairInfo) {
        const tokenAddress = isBuy ? tokenPairInfo.pairedToken?.address : tokenPairInfo.baseToken?.address;

        const fetchData = await fetchBalance({
          address: `0x${walletAddress.split('0x')[1]}`,
          token: `0x${tokenAddress?.split('0x')[1]}`
        })
        const balance = ethers.utils.formatUnits(fetchData.value, fetchData.decimals);

        setTokenBalance(Number(balance));
      }
    })()
  }, [isBuy, tokenPairInfo, walletAddress]);

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
    if (JSON.stringify(selectedOrder) !== "{}" && isEdit) {
      setTargetPrice(handleNumberFormat(selectedOrder.single_price ?? 0));
      setMinPrice(handleNumberFormat(selectedOrder.from_price ?? 0));
      setMaxPrice(handleNumberFormat(selectedOrder.to_price ?? 0));
      setAmount(handleNumberFormat(selectedOrder.budget ?? 0));
      setIsRange(selectedOrder.price_type === PriceTypeEnum.RANGE);
      setIsContinuous(selectedOrder.is_continuous ?? false);
    }
  }, [selectedOrder]);

  const closeClickHandler = () => {
    closeHandler();
    setTargetPrice(handleNumberFormat(-1));
    setMinPrice(handleNumberFormat(-1));
    setMaxPrice(handleNumberFormat(-1));
    setAmount(handleNumberFormat(-1));
    setIsContinuous(false);
    setShowEditOrderModal(false);
  };

  const toggle = () => {
    setIsContinuous((prevState) => !prevState);
  };
  const handleSubmit = async () => {
    if (!walletAddress) {
      return;
    }
    if (tokenPairInfo) {
      if (isEdit) {
        const newOrderPriceInfo: CreateOrderPriceInfo = {
          minPrice,
          maxPrice,
          targetPrice,
        };

        try {
          const newOrder = await editOrderInDb(
            selectedOrder,
            amount,
            isBuy,
            isRange,
            newOrderPriceInfo,
            token1Symbol,
            token2Symbol,
            isContinuous,
            walletAddress
          );

          //TOAST:
          if (fetchOrders) {
            fetchOrders();
          }

          await editOrderInContract(
            editContinuousTargetPriceOrder,
            editNonContinuousTargetPriceOrder,
            editContinuousPriceRangeOrder,
            editNonContinuousPriceRangeOrder,
            toast,
            newOrder,
            tokenPairInfo
          );

          setShowEditOrderModal(false);
        } catch (e) {
          setShowEditOrderModal(false);
        }
      } else {
        if (name1 && name2 && pair_address) {
          const newOrderPriceInfo: CreateOrderPriceInfoProps = {
            minPrice,
            maxPrice,
            targetPrice,
            name1,
            name2,
            pair_address,
          };

          try {
            const newOrder = await createOrderInDb(
              selectedOrder,
              amount,
              isBuy,
              isRange,
              newOrderPriceInfo,
              token1Symbol,
              token2Symbol,
              isContinuous,
              walletAddress
            );

            //TOAST:
            if (fetchOrders) {
              fetchOrders();
            }

            await createOrderInContract(
              createContinuousTargetPriceOrder,
              createNonContinuousTargetPriceOrder,
              createContinuousPriceRangeOrder,
              createNonContinuousPriceRangeOrder,
              toast,
              newOrder,
              tokenPairInfo
            );

            setShowEditOrderModal(false);
          } catch (e) {
            setShowEditOrderModal(false);
          }
        }
      }
    }
  };

  const applyMaxAmount = (amount: number) => {
    setAmount(amount.toString())
  }

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
              {!!tokenPairPriceInfo.base_price && (
                <>
                  $
                  {tokenPairPriceInfo.base_price >= 0.01
                    ? handleNumberFormat(
                        parseFloat(tokenPairPriceInfo.base_price.toFixed(2))
                      )
                    : convertLawPrice(tokenPairPriceInfo.base_price)}
                </>
              )}
            </span>
          </p>
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
                onChange={(e) =>
                  handleNumberInputChange(
                    setAmount,
                    setTargetPrice,
                    setMinPrice,
                    setMaxPrice,
                    "target",
                    e
                  )
                }
                onBlur={(e) =>
                  blurHandler(
                    setAmount,
                    setTargetPrice,
                    setMinPrice,
                    setMaxPrice,
                    "target",
                    e
                  )
                }
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
                  onChange={(e) =>
                    handleNumberInputChange(
                      setAmount,
                      setTargetPrice,
                      setMinPrice,
                      setMaxPrice,
                      "min",
                      e
                    )
                  }
                  onBlur={(e) =>
                    blurHandler(
                      setAmount,
                      setTargetPrice,
                      setMinPrice,
                      setMaxPrice,
                      "min",
                      e
                    )
                  }
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
                  onChange={(e) =>
                    handleNumberInputChange(
                      setAmount,
                      setTargetPrice,
                      setMinPrice,
                      setMaxPrice,
                      "max",
                      e
                    )
                  }
                  onBlur={(e) =>
                    blurHandler(
                      setAmount,
                      setTargetPrice,
                      setMinPrice,
                      setMaxPrice,
                      "max",
                      e
                    )
                  }
                />
              </div>
            </div>
          )}
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
              <input
                type="text"
                className="grow min-w-[100px] bg-tsuka-500 outline-none text-right text-2xl font-medium"
                value={amount}
                onChange={(e) =>
                  handleNumberInputChange(
                    setAmount,
                    setTargetPrice,
                    setMinPrice,
                    setMaxPrice,
                    "amount",
                    e
                  )
                }
                onBlur={(e) =>
                  blurHandler(
                    setAmount,
                    setTargetPrice,
                    setMinPrice,
                    setMaxPrice,
                    "amount",
                    e
                  )
                }
              />
            </div>
            <div className="w-full flex justify-between mt-1">
              <p className="text-sm">
                <span className="text-tsuka-200">Balance : </span>
                <span className="text-tsuka-50 uppercase">
                  {commafyOrHtmlTag(tokenBalance)} {(isBuy ? pairShortName : baseShortName) ?? ""}
                </span>
                <span className="text-custom-primary text-xs cursor-pointer" onClick={()=>{applyMaxAmount(tokenBalance)}}> MAX</span>
              </p>
              <span className="text-tsuka-50 text-sm">
                {(() => {
                  console.log(tokenPairPriceInfo);
                  let totalAmount = isBuy
                    ? tokenPairPriceInfo.quote_price *
                      parseFloat(amount.split(",").join(""))
                    : tokenPairPriceInfo.base_price *
                      parseFloat(amount.split(",").join(""));
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
