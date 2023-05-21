import { splitAddress } from "@/helpers/splitAddress.helper";
// import {
//   getToken,
//   getTokenVolume,
//   getYesterdayTokenPriceInPair,
//   setOrderSplit,
// } from "@/store/apps/token";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
// import { setPairAddress } from "@/store/apps/token";
import { InfoSpanToken } from "./info-span.token";
import { ApiResponse, Order, TokenPairInfo, TokenPriceInPair } from "@/types";
// import { getTokenPairInfo } from "@/store/apps/tokenpair-info";
// import { getTokenPriceInPair } from "@/store/apps/user-order";

import {
  convertLawPrice,
  handleNumberFormat,
} from "../my-order/edit-order.token";
import { GetServerSideProps } from "next";
import Orders from "@/lib/api/orders";
import HomePageTokens from "@/lib/api/tokens";
import { Token } from "@/types/token.type";
export interface FullHeaderTokenProps {
  pair_address: string;
  tokenPairInfo: TokenPairInfo;
  orders: Order[];
  token_price: TokenPriceInPair;
  oldTokenPrice: TokenPriceInPair;
  token?: Token;
  setToken: (t: Token) => void;
}

export const defaultNumberFormat = (num: number): any => {
  const newNum = Math.abs(num);
  let res;
  if (newNum >= 0.01) {
    res = handleNumberFormat(parseFloat(newNum.toFixed(2)));
  } else {
    res = Number(convertLawPrice(newNum));
    if (isNaN(res)) {
      res = "0";
    } else {
      res = res.toString().slice(1);
    }
  }
  return num >= 0 ? res : `-${res}`;
};

export const FullHeaderToken: React.FC<FullHeaderTokenProps> = ({
  pair_address,
  tokenPairInfo,
  orders,
  token_price,
  oldTokenPrice,
  token,
  setToken,
}) => {
  // const dispatch = useAppDispatch();
  // const { value, status } = useAppSelector((state) => state.token);
  const [value, setValue] = useState<Token | undefined>(token);
  const [status, setStatus] = useState<"ok" | "loading" | "failed">("ok");
  useEffect(() => {
    if (!token) {
      setStatus("loading");
      return;
    }
    setValue(token);
    setStatus("ok");
  }, [token]);

  // const baseTokenAddress = useAppSelector(
  //   (state) => state.tokenPairInfo.value.baseToken.address
  // );
  const baseTokenAddress = tokenPairInfo.baseToken.address;
  const [tokenVolume, setTokenVolume] = useState({
    value: 0,
    currencyLabel: "",
  });

  // useEffect(() => {
  //   if (pair_address) {
  //     dispatch(setPairAddress(pair_address as string));
  //   }
  // }, [pair_address]);

  useEffect(() => {
    if (baseTokenAddress) {
      (async () => {
        const volume = await HomePageTokens.getTokenVolume(baseTokenAddress);
        let newTokenVolume: { value: number; currencyLabel: string } = {
          value: 0,
          currencyLabel: "",
        };
        const MILLION = 1e6,
          BILLION = 1e9,
          TRILLION = 1e12;
        if (volume.tradeAmount > TRILLION) {
          newTokenVolume.value = volume.tradeAmount / TRILLION;
          newTokenVolume.currencyLabel = "Trillion";
        } else if (volume.tradeAmount > BILLION) {
          newTokenVolume.value = Number(
            (volume.tradeAmount / BILLION).toString().slice(0, 4)
          );
          newTokenVolume.currencyLabel = "Billion";
        } else if (volume.tradeAmount > MILLION) {
          newTokenVolume.value = Number(
            (volume.tradeAmount / MILLION).toString().slice(0, 4)
          );
          newTokenVolume.currencyLabel = "Million";
        } else {
          newTokenVolume.value = volume.tradeAmount;
          newTokenVolume.currencyLabel = "";
        }
        setTokenVolume(newTokenVolume);
      })();
    }
  }, [baseTokenAddress]);

  useEffect(() => {
    let total_sell: number = 0;
    let total_buy: number = 0;
    let price: number = 0;
    if (orders) {
      total_sell = orders.filter((ele, id) => ele.order_type === "sell").length;
      total_buy = orders.filter((ele, id) => ele.order_type === "buy").length;
      price = orders.reduce(
        (prev, curr, index, array) => prev + (curr.budget ?? 0),
        0
      );
    }
    if (!token) return;
    setToken({ ...token, orderSplit: { buy: total_buy, sell: total_sell } });
    // dispatch(
    //   setOrderSplit({
    //     orderSplit: {
    //       buy: total_buy,
    //       sell: total_sell,
    //     },
    //   })
    // );
  }, [orders]);

  return (
    <div className="w-full text-tsuka-300 flex py-2 mb-4 sm:flex-col items-center sm:items-start lg:items-center lg:flex-row justify-between sm:justify-normal lg:justify-between">
      {status === "loading" && (
        <>
          <Link href="/" className="text-xl p-2 rounded-full cursor-pointer">
            <MdArrowBack />
          </Link>
          &quot;Loading...&quot;
        </>
      )}
      {status === "ok" && value && (
        <>
          <div className="flex sm:mb-8 lg:mb-0 items-center">
            <Link
              href="/"
              className="text-xl pr-2 xs:p-2 rounded-full cursor-pointer"
            >
              <MdArrowBack />
            </Link>
            <div className="px-2 flex-1 flex-col">
              <p className="text-sm xs:text-base">
                <label className="text-tsuka-50 text-xl xs:text-2xl font-semibold">
                  {tokenPairInfo.baseToken.symbol}
                </label>
                /{tokenPairInfo.pairedToken.symbol}
              </p>
              <div className="flex items-start flex-col md:flex-row">
                <label className="text-xs whitespace-nowrap">
                  Pair Address:{" "}
                </label>
                <div className="flex flex-col items-center justify-around ml-2">
                  <label className="text-xs text-tsuka-50">
                    {splitAddress(value.pair?.address as string)}
                  </label>
                </div>
                <label className="text-xs whitespace-nowrap md:ml-4"></label>
              </div>
            </div>
          </div>
          <div className=" lg:flex-1 flex w-full lg:w-auto justify-end sm:justify-between lg:justify-end items-center">
            <div className="hidden sm:flex text-sm mr-12">
              <InfoSpanToken title={"TXS"} value={orders ? orders.length : 0} />
              <div className="flex items-center border border-tsuka-400 pt-1 mx-2">
                <label className="absolute -mt-16 ml-4 bg-tsuka-700 px-2 text-tsuka-200">
                  ORDERS
                </label>
                <InfoSpanToken title={"BUY"} value={value.orderSplit?.buy} />
                <InfoSpanToken title={"SELL"} value={value.orderSplit?.sell} />
              </div>
              <InfoSpanToken
                title={"VOL."}
                value={`$${defaultNumberFormat(tokenVolume.value ?? 0)} ${
                  tokenVolume.currencyLabel
                }`}
              />
              <InfoSpanToken
                title={"24h"}
                value={`${defaultNumberFormat(
                  token_price?.base_price
                    ? ((token_price.base_price -
                        (oldTokenPrice?.base_price ?? 0)) /
                        token_price.base_price) *
                        100
                    : 0
                ).toString()}%`}
              />
            </div>
            <div className="text-sm justify-end">
              <div className="flex flex-col lg:flex-row items-end justify-end">
                <div className="text-tsuka-50 xs:ml-2 text-base xs:text-xl md:text-2xl">
                  {token_price?.base_price &&
                    (token_price.base_price >= 0.01
                      ? `$${handleNumberFormat(
                          parseFloat(token_price.base_price.toFixed(2))
                        )}`
                      : convertLawPrice(token_price.base_price))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
