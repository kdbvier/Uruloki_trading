import { splitAddress } from "@/helpers/splitAddress.helper";
import { getToken, setOrderSplit } from "@/store/apps/token";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { HorizontalIconsToken } from "./horizontal-icons.token";
import { setPairAddress } from "@/store/apps/token";
import { InfoSpanToken } from "./info-span.token";
export interface FullHeaderTokenProps {
  token: {
    id: string;
    token: string;
  };
  pair_address: string;
}

export const FullHeaderToken: React.FC<FullHeaderTokenProps> = ({
  token,
  pair_address,
}) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.token);
  const [orders, setOrders] = useState<Array<any>>([]);

  useEffect(() => {
    const getOrders = async () => {
      let result: any =
        value.pair?.address &&
        (await fetch(
          `/api/orders/tokenpair/${encodeURIComponent(pair_address)}`
        ));

      if (result !== undefined) {
        result.json().then((res: any) => {
          setOrders(res.payload);
        });
      }
    };
    getOrders();
    console.log("parir", pair_address);
    
    dispatch(setPairAddress(pair_address as string));
  }, [pair_address]);

  useEffect(() => {
    let total_sell: number = 0;
    let total_buy: number = 0;
    let price: number = 0;
    if (orders) {
      total_sell = orders.filter((ele, id) => ele.order_type === "sell").length;
      total_buy = orders.filter((ele, id) => ele.order_type === "buy").length;
      price = orders.reduce(
        (prev, curr, index, array) => prev + curr.budget,
        0
      );
    }
    dispatch(
      setOrderSplit({
        orderSplit: {
          buy: total_buy,
          sell: total_sell,
        },
        volume: {
          value: String(price),
          currencyLabel: "Billions",
        },
        price: {
          value: String(price / 1000),
          operator: "",
          variationValue: 0,
        },
      })
    );
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
            <HorizontalIconsToken
              inputToken={value.chain}
              outputToken={value.pair as any}
              large={true}
            />
            <div className="px-2 flex-1 flex-col">
              <p className="text-sm xs:text-base">
                <label className="text-tsuka-50 text-xl xs:text-2xl font-semibold">
                  {value.chain?.code}
                </label>
                /{value.pair?.code}
              </p>
              <div className="flex items-start flex-col md:flex-row">
                <label className="text-xs whitespace-nowrap">
                  Pair Token:{" "}
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
                value={`$${value.volume?.value}${value.volume?.currencyLabel[0]}`}
              />
              <InfoSpanToken
                title={"24h"}
                value={`${value.price?.operator}${value.price?.variationValue}%`}
              />
            </div>
            <div className="text-sm justify-end">
              <div className="flex flex-col lg:flex-row items-end justify-end">
                <div
                  className={`${
                    value.price?.operator === "+"
                      ? "text-custom-green"
                      : "text-custom-red"
                  }`}
                >
                  {value.price?.variationValue}%
                </div>
                <div className="text-tsuka-50 xs:ml-2 text-base xs:text-xl md:text-2xl">
                  ${value.price?.value}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-end md:items-center justify-end mt-1">
                <div
                  className={`${
                    !(value.price?.operator === "+")
                      ? "text-custom-green"
                      : "text-custom-red"
                  }`}
                >
                  {value.price?.variationValueDiference}
                </div>
                <div className="text-tsuka-50 text-xs xs:ml-2">
                  {value.chain?.code} {value.price?.value}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="hidden xs:flex md:hidden text-sm pt-6 mt-4 border-t border-tsuka-400">
            <InfoSpanToken title={"TXS"} value={"189"} />
            <div className="flex items-center border border-tsuka-400 pt-1 mx-2">
              <label className="absolute -mt-16 ml-4 bg-tsuka-700 px-2 text-tsuka-200">
                ORDERS
              </label>
              <InfoSpanToken title={"BUY"} value={value.orderSplit?.buy} />
              <InfoSpanToken title={"SELL"} value={value.orderSplit?.sell} />
            </div>
            <InfoSpanToken
              title={"VOL."}
              value={`$${value.volume?.value}${value.volume?.currencyLabel[0]}`}
            />
            <InfoSpanToken
              title={"24h"}
              value={`${value.price?.operator}${value.price?.variationValue}%`}
            />
          </div> */}
        </>
      )}
    </div>
  );
};
