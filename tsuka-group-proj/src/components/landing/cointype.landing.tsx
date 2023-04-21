import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import * as coinhelper from "../../helpers/coin.helper";

export interface CoinTypeProps {
  coins: CoinType[];
}

interface CoinType {
  url: string;
  name: string;
  abbr: string;
  price: number;
  rate: number;
}

export const CoinTypeLanding: React.FC<CoinTypeProps> = ({ coins }) => {
  return (
    <div className="w-[1440px] bg-tsuka-700 py-4 overflow-hidden">
      <div className="w-full flex items-center gap-20">
        {coins.map((cointype) => {
          return (
            <div key={cointype.name} className="flex text-white items-center ">
              <Image
                src={cointype.url}
                alt="cointype__image"
                width={20}
                height={20}
              ></Image>
              <h1 className="text-base font-normal text-[#828AA0]">
                {cointype.name}
              </h1>
              <h2 className="text-sm font-normal text-[#676F84] uppercase px-1">
                {cointype.abbr}
              </h2>
              <h3 className="pl-10 text-sm font-normal text-[#828AA0]">
                {coinhelper.formatCurrencyFixed2(cointype.price)}
              </h3>
              <h4 className="text-[#6FCF97] flex text-sm items-center">
                <FiArrowUpRight fontSize={20} />
                {coinhelper.formatSignedPercent(cointype.rate)}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};
