import { StrategyBookStrategies } from "@/components/strategies/strategy-book.strategies";
import Strategies from "@/lib/api/strategies";
import { Strategy } from "@/types";
import Link from "next/link";

export async function getServerSideProps() {
  const strategies = await Strategies.getStrategiesData();
  return { props: {strategies:strategies} }
}

export default function StrategyDetails({strategies}:{strategies:Strategy[]}) {
  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      <div className="w-full gap-4 text-tsuka-300 flex py-2 mb-2 md:items-center flex-row">
        <Link
          href={"/strategies"}
          className={
            "hidden md:block text-[40px] leading-[52px] font-medium text-tsuka-50"
          }
        >
          My Setups
        </Link>
        <Link
          href={"/my-orders"}
          className={
            "hidden md:block text-[24px] leading-[52px] text-tsuka-200"
          }
        >
          My Orders
        </Link>
      </div>
      {strategies && <StrategyBookStrategies strategies={strategies} />}
    </div>
  );
}
