import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { ITopGainersTokenProps } from "@/global";
import { commafy } from "@/helpers/calc.helper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiArrowUpRight, FiRefreshCcw } from "react-icons/fi";

export const TopGainers: React.FC<ITopGainersTokenProps> = ({ topGainers }) => {
  const router = useRouter();
  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">
          Top Gainers
        </span>
        <Link
          className="flex items-center text-xs text-custom-primary"
          href="#"
        >
          <FiRefreshCcw className="mr-1" />
          Auto-Refreshed in 5 sec.
        </Link>
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
            {topGainers.map((topGainer, idx) => {
              return (
                <tr
                  onClick={() => {
                    router.push("/pair/2");
                  }}
                  className="cursor-pointer border-t border-t-tsuka-400"
                  key={idx}
                >
                  <td className="py-2 md:py-5">
                    {topGainer.rank >= 1 && topGainer.rank <= 3 ? (
                      <Image
                        src={`/icons/medal${topGainer.rank}.png`}
                        width={24}
                        height={24}
                        alt={"medal" + topGainer.rank}
                      />
                    ) : (
                      <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-normal">
                        #{idx}
                      </span>
                    )}
                  </td>
                  <td className="py-2 md:py-5 flex items-center">
                    <TokenIconsToken
                      name={topGainer.token.id}
                      shortName={topGainer.token.shortName}
                    />
                    <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                      <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">
                        {topGainer.token.name}
                      </p>
                      <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">
                        {topGainer.token.shortName}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 md:py-5">
                    <div className="flex gap-1 md:gap-0 flex-col md:flex-row items-end md:items-center text-[14px] leading-[18px] font-normal">
                      <span className="text-tsuka-200">
                        ${commafy(topGainer.price)}
                      </span>
                      <div className="ml-2 flex text-[#6FCF97]">
                        <FiArrowUpRight className="mt-0.5" />
                        <span>{`${topGainer.risingPercent}%`}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
