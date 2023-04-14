import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiRefreshCcw } from "react-icons/fi";
import { commafy } from "@/helpers/calc.helper";

interface IToken {
  token: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  sellOrders: number;
}
export interface MostSellOrdersProps {
  tokens: IToken[]
}

export const MostSellOrders: React.FC<MostSellOrdersProps> = ({
  tokens
}) => {
  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">Most Sell Orders</span>
        <Link className="flex items-center text-xs text-[#AF71FF]" href="#"><FiRefreshCcw />Auto-Refreshed in 5 sec.</Link>
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
              tokens.map((token, idx) => {
                return (
                  <tr className="border-t border-t-tsuka-400" key={idx}>
                    <td className="py-2 md:py-5">
                      {
                        idx >= 0 && idx < 3 ?
                          <Image src={`/icons/medal${idx + 1}.png`} width={24} height={24} alt={"medal" + (idx + 1)} />
                        :
                          <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-medium">#{idx + 1}</span>
                      }
                    </td>
                    <td className="py-2 md:py-5 flex items-center">
                      <Image src={token.token.imgUrl} width={24} height={24} alt="medal1" />
                      <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                        <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{token.token.name}</p>
                        <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{token.token.shortName}</p>
                      </div>
                    </td>
                    <td className="py-2 md:py-5 text-right md:text-left">
                      <span className="text-tsuka-200">{commafy(token.sellOrders)}</span>
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
