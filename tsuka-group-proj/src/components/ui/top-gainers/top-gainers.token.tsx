import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiRefreshCcw } from "react-icons/fi";
import { commafy, commafy2 } from "@/helpers/calc.helper";

interface IToken {
  token: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  price: number;
  risingPercent: number;
}
export interface TopGainersProps {
  tokens: IToken[]
}

export const TopGainers: React.FC<TopGainersProps> = ({
  tokens
}) => {
  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">Top Gainers</span>
        <Link className="flex items-center text-xs text-[#AF71FF]" href="#"><FiRefreshCcw />Auto-Refreshed in 5 sec.</Link>
      </div>

      <div className="scrollable pr-1 h-[270px] md:h-[294px] overflow-y-auto overflow-x-hidden mt-5">
        <table className="w-full text-left">
          <thead className="">
            <tr className="text-tsuka-300 text-[14px] leading-[18px] font-medium">
              <th className="py-2 text-center pr-2">#</th>
              <th className="py-2">Tokens</th>
              <th className="py-2 text-right md:text-left">Price(USD)</th>
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
                          <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-normal">#{idx + 1}</span>
                      }
                    </td>
                    <td className="py-2 md:py-5 flex items-center">
                      <Image src={token.token.imgUrl} width={24} height={24} alt="medal1" />
                      <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                        <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{token.token.name}</p>
                        <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{token.token.shortName}</p>
                      </div>
                    </td>
                    <td className="py-2 md:py-5">
                      <div className="flex gap-1 md:gap-0 flex-col md:flex-row items-end md:items-center text-[14px] leading-[18px] font-normal">
                        <span className="text-tsuka-200">${commafy(token.price)}</span>
                        <div className="ml-2 flex text-[#6FCF97]">
                          <FiArrowUpRight className="mt-0.5" />
                          <span>{`${token.risingPercent}%`}</span>
                        </div>
                      </div>
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
