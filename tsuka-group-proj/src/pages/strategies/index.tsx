import { StrategyBookStrategies } from "@/components/strategies/strategy-book.strategies";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { Strategies } from "@/lib/strategies/strategies";
import { getStrategies } from "@/store/apps/strategies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Strategy } from "@/types";
import Link from "next/link";

export async function getServerSideProps() {
  const walletAddress = await getConnectedAddress();
  const strategies = await Strategies.getStrategiesData(
    //walletAddress as string
    "0xtest"
  );
  return { props: { strategies: strategies } };
}

export default function StrategyDetails({
  strategies,
}: {
  strategies: Strategy[];
}) {
  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      <div className="w-full gap-4 text-tsuka-300 flex py-2 mb-2 md:items-center justify-center md:justify-start flex-row">
        <Link
          href={"/strategies"}
          className={
            "text-[32px] md:text-[40px] leading-[36px] md:leading-[52px] font-medium text-tsuka-50"
          }
        >
          My Setups
        </Link>
        <Link
          href={"/my-orders"}
          className={
            "text-[24px] leading-[36px] md:leading-[52px] text-tsuka-200"
          }
        >
          My Orders
        </Link>
      </div>
      {strategies && <StrategyBookStrategies strategies={strategies} />}
    </div>
  );
}
