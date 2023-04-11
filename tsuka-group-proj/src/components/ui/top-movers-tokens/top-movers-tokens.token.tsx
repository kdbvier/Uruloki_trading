import Image from "next/image";
import {
  FiFilter,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight,
  FiChevronUp,
  FiChevronDown,
  FiArrowDown,
} from "react-icons/fi";
import { OrderSplitBar } from "@/components/ui/top-movers-tokens/order-split-bar.token";
import { commafy, commafy2 } from "@/helpers/calc.helper";
import { useState, useEffect } from "react";

interface IToken {
  id: number;
  token: string;
  chain: {
    name: string;
    shortName: string;
    imgUrl: string;
  };
  price: number;
  risingPercent: number;
  volume: number;
  marketCap: number;
  orderCount: number;
  buyOrderCount: number;
  sellOrderCount: number;
}
export interface TopMoversTokensProps {
  tokens: IToken[]
}

export const TopMoversTokens: React.FC<TopMoversTokensProps> = ({
  tokens
}) => {
  const [collapeds, setCollapeds] = useState<boolean[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    let tempArray: boolean[] = [];
    for (let i = 0; i < tokens.length; i++) {
      tempArray[i] = true;
    }
    setCollapeds(tempArray);
  }, []);

  const toggle = (idx: number) => {
    let newValue = !collapeds[idx];
    let newArray = [...collapeds];
    newArray[idx] = newValue;
    setCollapeds(newArray);
  }

  return (
    <div className="w-full bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className={`md:flex justify-between items-center`}>
        <h1 className="mb-3 md:mb-0text-[18px] md:text-[24px] leading-6 md:leading-8 font-medium text-tsuka-50">Top Movers Tokens</h1>
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
            <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
            <input type="text" className="w-full md:w-[200px] border border-tsuka-400 bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300" placeholder="Find tokens..." />
          </div>
          <button
            type="button"
            className={`px-3 py-[11px] border border-tsuka-400 focus:outline-none bg-tsuka-500 text-tsuka-100 rounded-md text-sm flex items-center`}
          >
            <label className="mr-1 text-tsuka-200 text-base">
              <FiFilter />
            </label>
            Filters
          </button>
        </div>
      </div>

      <div className={`relative`}>
        <table className="w-full text-left mt-4">
          <thead className="">
            <tr className="text-tsuka-300 text-[14px] leading-[18px] font-medium">
              <th className="py-2 pl-2">#</th>
              <th className="py-2 hidden md:table-cell">ID</th>
              <th className="py-2 hidden md:table-cell">Tokens</th>
              <th className="py-2">Chains</th>
              <th className="py-2">Price(USD)</th>
              <th className="py-2 hidden md:table-cell">Volume</th>
              <th className="py-2 hidden md:table-cell">Market Cap</th>
              <th className="py-2 hidden md:table-cell">Total Num. of Orders</th>
              <th className="py-2 hidden md:table-cell">Order Split</th>
              <th className="md:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {
              tokens.map((token, idx) => {
                if (!showAll && idx > 4) return
                return (
                  <>
                    <tr className="border-t border-t-tsuka-400" key={idx}>
                      <td className="py-2 md:py-8">
                        <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-medium">#{idx + 1}</span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="ml-1 text-tsuka-50 text-[16px] leading-[20px] font-normal">{token.id}</span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="ml-1 text-tsuka-50 text-[16px] leading-[20px] font-normal">{token.token}</span>
                      </td>
                      <td className="py-2 md:py-8 flex items-center">
                        <Image src={token.chain.imgUrl} width={24} height={24} alt="medal1" />
                        <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                          <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{token.chain.name}</p>
                          <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{token.chain.shortName}</p>
                        </div>
                      </td>
                      <td className="py-2 md:py-8 text-right md:text-left">
                        <div className="flex gap-1 md:gap-0 flex-col md:flex-row items-end md:items-center text-[14px] leading-[18px] font-normal">
                          <span className="text-tsuka-200">{`$${commafy(token.price)}`}</span>
                          {
                            token.risingPercent > 0 ?
                              <div className="ml-2 flex text-[#6FCF97]">
                                <FiArrowUpRight className="mt-0.5" />
                                <span>{`${token.risingPercent}%`}</span>
                              </div>
                            :
                              <div className="ml-2 flex text-[#EB5757]">
                                <FiArrowDownRight className="mt-0.5" />
                                <span>{`${0 - token.risingPercent}%`}</span>
                              </div>
                          }
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="text-tsuka-200">{`$${commafy(token.volume)}`}</span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="text-tsuka-200">{`$${commafy(token.marketCap)}`}</span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="text-tsuka-200">{`${commafy(token.orderCount)}`}</span>
                      </td>
                      <td className="hidden md:table-cell">
                        <OrderSplitBar buyOrderCount={token.buyOrderCount} sellOrderCount={token.sellOrderCount} />
                      </td>
                      <td className="md:hidden pl-2" onClick={() => toggle(idx)}>
                        {
                          collapeds[idx] ? <FiChevronDown /> : <FiChevronUp />
                        }
                      </td>
                    </tr>
                    {
                      !collapeds[idx] &&
                      <tr className="md:hidden" key={idx * -1}>
                        <td colSpan={4}>
                          <div className="w-full bg-tsuka-400 rounded-lg p-3 mb-2">
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">Chain</span>
                              <span className="text-[14px] leading-[18px] text-tsuka-100">
                                <span className="text-tsuka-50 mr-1">{token.chain.name}</span>
                                <span>{token.chain.shortName}</span>
                              </span>
                            </div>
                            <hr className="border-tsuka-300 my-2" />
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">Volume</span>
                              <span className="text-[14px] leading-[18px] text-tsuka-50">
                                {`$${commafy2(token.volume)}`}
                              </span>
                            </div>
                            <hr className="border-tsuka-300 my-2" />
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">Market Cap</span>
                              <span className="text-[14px] leading-[18px] text-tsuka-50">
                                {`$${commafy2(token.marketCap)}`}
                              </span>
                            </div>
                            <hr className="border-tsuka-300 my-2" />
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">Total Num. of Orders</span>
                              <span className="text-[14px] leading-[18px] text-tsuka-50">
                                {`${commafy2(token.orderCount)}`}
                              </span>
                            </div>
                            <div className="w-full mt-[11px]"></div>
                            <OrderSplitBar buyOrderCount={token.buyOrderCount} sellOrderCount={token.sellOrderCount} />
                          </div>
                        </td>
                      </tr>
                    }
                  </>
                )
              })
            }
          </tbody>
        </table>
        {
          !showAll &&
          <div className="relative w-full h-16 md:h-28 -mt-12 md:-mt-24 bg-gradient-to-t from-[#1F2333FF] to-[#1F233300]">
            <div className="w-full h-full flex justify-center items-end text-[#AF71FF]">
              <button
                className="border border-tsuka-400 rounded-md px-3 py-2 flex items-center gap-1 bg-tsuka-500"
                onClick={() => setShowAll(true)}
              >
                <FiArrowDown /><span>Show more</span>
              </button>
            </div>
          </div>
        }
        {
          // !showAll &&
          // <div className="w-full h-28 -mt-28 bg-gradient-to-t from-[#1F2333FF] to-[#1F233300]">
          //   <div className="w-full h-full flex justify-center items-end text-[#AF71FF]">
          //     <button
          //       className="border border-tsuka-400 rounded-md px-3 py-2 flex items-center gap-1 bg-tsuka-500"
          //       onClick={() => setShowAll(true)}
          //     >
          //       <FiArrowDown /><span>Show more</span>
          //     </button>
          //   </div>
          // </div>
        }
      </div>
    </div>
  );
};
