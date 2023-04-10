import { tokensData } from "@/@fake-data/token.fake-data";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { useRouter } from "next/router";

export default function Pair({ id }: { id: string }) {
  const router = useRouter();
  const { pair_id = id || "" } = router.query;
  const inputToken = tokensData
    .map((token) => {
      return { id: token.id, token: token.chain.code };
    })
    .find((item) => item.id === pair_id)!;

  const networks = ["ETH", "BSC", "POLYGON"];

  return (
    <div className="flex flex-col">
      {inputToken && (
        <>
          <FullHeaderToken token={inputToken} />
          <div className="hidden md:grid grid-cols-11 gap-4">
            {/* <div className="col-span-12 md:col-span-3">
              <CompareTokenChainToken token={inputToken} networks={networks} />
            </div> */}
            <div className="col-span-12 md:col-span-8">
              <LiveGraphToken token={inputToken} />
              <div className="hidden md:grid grid-cols-8 gap-4">
                <div className="col-span-12 md:col-span-3">
                  <PoolInfoToken token={inputToken} />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <AllPositionsToken token={inputToken} />
                </div>
              </div>
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
