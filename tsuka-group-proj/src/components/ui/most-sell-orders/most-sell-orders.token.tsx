import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiRefreshCcw } from "react-icons/fi";
import { commafy } from "@/helpers/calc.helper";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { IMostSellOrdersTokenProps } from "@/global";

export const MostSellOrders: React.FC<IMostSellOrdersTokenProps> = ({
  mostSellOrders
}) => {
  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">Most Sell Orders</span>
        <Link className="flex items-center text-xs text-[#AF71FF]" href="#"><FiRefreshCcw className="mr-1" />Auto-Refreshed in 5 sec.</Link>
      </div>

      <div className="scrollable pr-1 h-[270px] md:h-[294px] overflow-y-auto overflow-x-hidden mt-5">
        <table className="w-full text-left">
          <thead className="">
            <tr className="text-tsuka-300 text-[14px] leading-[18px] font-medium">
              <th className="py-2 text-center pr-2">#</th>
              <th className="py-2">Tokens</th>
              <th className="py-2 text-right md:text-left">Sell Orders</th>
            </tr>
          </thead>
          <tbody>
            {
              mostSellOrders.map((mostSellOrder, idx) => {
                return (
                  <tr className="border-t border-t-tsuka-400" key={idx}>
                    <td className="py-2 md:py-5">
                      {
                        mostSellOrder.rank >= 1 && mostSellOrder.rank <= 3 ?
                          <Image src={`/icons/medal${mostSellOrder.rank}.png`} width={24} height={24} alt={"medal" + (mostSellOrder.rank)} />
                        :
                          <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-medium">#{mostSellOrder.rank}</span>
                      }
                    </td>
                    <td className="py-2 md:py-5 flex items-center">
                      <TokenIconsToken name={mostSellOrder.token.id} shortName={mostSellOrder.token.shortName} />
                      <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                        <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{mostSellOrder.token.name}</p>
                        <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{mostSellOrder.token.shortName}</p>
                      </div>
                    </td>
                    <td className="py-2 md:py-5 text-right md:text-left">
                      <span className="text-tsuka-200">{commafy(mostSellOrder.sellOrders)}</span>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};