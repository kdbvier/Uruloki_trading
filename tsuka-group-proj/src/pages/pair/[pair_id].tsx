import { tokensData } from "@/@fake-data/token.fake-data";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { CompareTokenChainToken } from "@/components/tokens/compare-token-chain.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { useRouter } from "next/router";

export default function Pair() {
  const router = useRouter();
  const { pair_id = "" } = router.query;
  const inputToken = tokensData
    .map((token) => {
      return { id: token.id, token: token.chain.code, icon: token.chain.icon };
    })
    .find((item) => item.id === pair_id)!;

  const networks = ["ETH", "BSC", "POLYGON"];

  return (
    <div className="flex flex-col">
      {inputToken && (
        <>
          <FullHeaderToken token={inputToken} />
          <div className="hidden md:grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <CompareTokenChainToken token={inputToken} networks={networks} />
              <PoolInfoToken token={inputToken} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <LiveGraphToken token={inputToken} />
              <AllPositionsToken token={inputToken} />
            </div>
            <div className="col-span-12 md:col-span-3">
              <OrderWidgetToken token={inputToken} />
            </div>
          </div>
          <div className="block md:hidden">
            <LiveGraphToken token={inputToken} />
            <OrderWidgetToken token={inputToken} />
            <AllPositionsToken token={inputToken} />
            <PoolInfoToken token={inputToken} />
          </div>
        </>
      )}
    </div>
  );
}
