import { splitAddress } from "@/helpers/splitAddress.helper";
import { getToken } from "@/store/apps/token";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { HorizontalIconsToken } from "./horizontal-icons.token";
import { InfoSpanToken } from "./info-span.token";
export interface FullHeaderTokenProps {
  token: {
    id: string;
    token: string;
  };
}

export const FullHeaderToken: React.FC<FullHeaderTokenProps> = ({ token }) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.token);

  useEffect(() => {
    dispatch(getToken(token.id));
  }, [dispatch, token]);

  return (
    <div className="w-full text-tsuka-300 flex items-start py-2 mb-4 flex-col md:items-center md:flex-row">
      <a href="/" className="text-xl p-2 rounded-full cursor-pointer">
        <MdArrowBack />
      </a>
      {status === "loading" && "Loading..."}
      {status === "ok" && value && (
        <>
          <div className="flex w-full items-center justify-center">
            <HorizontalIconsToken
              inputIconPath={value.chain?.icon}
              outputIconPath={value.pair?.icon as string}
              large={true}
            />
            <div className="px-2 flex-1 flex-col">
              <p className="text-base">
                <label className="text-tsuka-50 text-2xl font-semibold">
                  {value.chain?.code}
                </label>
                /{value.pair?.code}
              </p>
              <div className="flex items-start flex-col md:flex-row">
                <label className="text-xs whitespace-nowrap">
                  Token:{" "}
                  <label
                    className={`${
                      value.price?.operator === "+"
                        ? "text-green-400"
                        : "text-red-400"
                    } text-xs`}
                  >
                    {splitAddress(value.chain?.address as string)}
                  </label>
                </label>
                <label className="text-xs whitespace-nowrap md:ml-4">
                  Token:{" "}
                  <label className="text-xs text-tsuka-50">
                    {splitAddress(value.pair?.address as string)}
                  </label>
                </label>
              </div>
            </div>
            <div className="hidden md:flex text-sm mr-12">
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
            </div>
            <div className="text-sm justify-end">
              <div className="flex items-end justify-end">
                <div
                  className={`${
                    value.price?.operator === "+"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {value.price?.variationValue}%
                </div>
                <div className="text-tsuka-50 ml-2 text-xl md:text-2xl">
                  ${value.price?.value}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-end md:items-center justify-end mt-1">
                <div
                  className={`${
                    !(value.price?.operator === "+")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {value.price?.variationValueDiference}
                </div>
                <div className="text-tsuka-50 ml-2">
                  {value.chain?.code} {value.price?.value}
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:hidden text-sm pt-6 mt-4 border-t border-tsuka-400">
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
          </div>
        </>
      )}
    </div>
  );
};
