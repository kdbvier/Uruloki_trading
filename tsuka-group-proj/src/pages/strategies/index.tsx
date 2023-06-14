import { StrategiesPageComponent } from "@/components/strategies/strategy-page-component";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { Strategies } from "@/lib/strategies/strategies";
import { Strategy } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StrategyDetails() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  async function onLoad() {
    const walletAddress = await getConnectedAddress();
    const tempStrategies = await Strategies.Client.getStrategiesData(walletAddress as string)
    setStrategies(tempStrategies)
  }

  useEffect(() => {
    onLoad()
  }, [])

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
      {strategies && <StrategiesPageComponent strategies={strategies} />}
    </div>
  );
}
