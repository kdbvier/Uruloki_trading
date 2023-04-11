import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiRefreshCcw } from "react-icons/fi";

interface IToken {
  token: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  buyOrders: number;
}
export interface MostBuyOrdersProps {
  tokens: IToken[]
}

export const MostBuyOrders: React.FC<MostBuyOrdersProps> = ({
  tokens
}) => {
  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">Top Gainers</span>
        <Link className="flex items-center text-xs text-[#AF71FF]" href="#"><FiRefreshCcw />Auto-Refreshed in 5 sec.</Link>
      </div>

      <table className="w-full text-left mt-5">
        <thead className="">
          <tr className="text-tsuka-300 text-[14px] leading-[18px] font-medium">
            <th className="py-2 text-center pr-2">#</th>
            <th className="py-2">Tokens</th>
            <th className="py-2 text-right md:text-left">Buy Orders(USD)</th>
          </tr>
        </thead>
        <tbody>
          {
            tokens[0] ?
              <tr className="border-t border-t-tsuka-400">
                <td className="py-2 md:py-5">
                  <Image src="/icons/medal1.png" width={24} height={24} alt="medal1" />
                </td>
                <td className="py-2 md:py-5 flex items-center">
                  <Image src={tokens[0].token.imgUrl} width={24} height={24} alt="medal1" />
                  <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                    <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{tokens[0].token.name}</p>
                    <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{tokens[0].token.shortName}</p>
                  </div>
                </td>
                <td className="py-2 md:py-5 text-right md:text-left">
                  <span className="text-tsuka-200">{tokens[0].buyOrders}</span>
                </td>
              </tr>
            :
              <tr className="h-16 border-t border-t-tsuka-400"></tr>
          }
          {
            tokens[1] ?
              <tr className="border-t border-t-tsuka-400">
                <td className="py-2 md:py-5">
                  <Image src="/icons/medal2.png" width={24} height={24} alt="medal1" />
                </td>
                <td className="py-2 md:py-5 flex items-center">
                  <Image src={tokens[1].token.imgUrl} width={24} height={24} alt="medal1" />
                  <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                    <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{tokens[1].token.name}</p>
                    <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{tokens[1].token.shortName}</p>
                  </div>
                </td>
                <td className="py-2 md:py-5 text-right md:text-left">
                  <span className="text-tsuka-200">{tokens[1].buyOrders}</span>
                </td>
              </tr>
            :
              <tr className="h-16 border-t border-t-tsuka-400"></tr>
          }
          {
            tokens[2] ?
              <tr className="border-t border-t-tsuka-400">
                <td className="py-2 md:py-5">
                  <Image src="/icons/medal3.png" width={24} height={24} alt="medal1" />
                </td>
                <td className="py-2 md:py-5 flex items-center">
                  <Image src={tokens[2].token.imgUrl} width={24} height={24} alt="medal1" />
                  <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                    <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{tokens[2].token.name}</p>
                    <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{tokens[2].token.shortName}</p>
                  </div>
                </td>
                <td className="py-2 md:py-5 text-right md:text-left">
                  <span className="text-tsuka-200">{tokens[2].buyOrders}</span>
                </td>
              </tr>
            :
              <tr className="h-16 border-t border-t-tsuka-400"></tr>
          }
          {
            tokens[3] ?
              <tr className="border-t border-t-tsuka-400">
                <td className="py-2 md:py-5">
                  <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-normal">#4</span>
                </td>
                <td className="py-2 md:py-5 flex items-center">
                  <Image src={tokens[3].token.imgUrl} width={24} height={24} alt="medal1" />
                  <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                    <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">{tokens[3].token.name}</p>
                    <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">{tokens[3].token.shortName}</p>
                  </div>
                </td>
                <td className="py-2 md:py-5 text-right md:text-left">
                  <span className="text-tsuka-200">{tokens[3].buyOrders}</span>
                </td>
              </tr>
            :
              <tr className="h-16 border-t border-t-tsuka-400"></tr>
          }
        </tbody>
      </table>
    </div>
  );
};
