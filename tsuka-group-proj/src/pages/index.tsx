import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";
import { IBenifitsItemFields } from "@/@types/generated/contentful.types";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { CompareTokenChainToken } from "@/components/tokens/compare-token-chain.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import ContentService, {getBenifitItemsEntries} from "@/lib/content-service";
// import { getEntries } from "@/lib/contentful_1";

import { useEffect } from "react";

export default function Home() {
  const titles = formItensData;
  const data = tokensData;
  const [inputToken, outputToken] = data.map((token) => {
    return { id: token.id, token: token.chain.code, icon: token.chain.icon };
  });

  useEffect(() => {
    // getEntries().then((items)=> console.error("items:::", items));
    // const entries = (await (ContentService.instance.getEntriesByType<IBenifitsItemFields>("article"))).map((entry: { fields: any; })=>entry.fields);
    // console.log(entries);
    getBenifitItemsEntries();
  }, [])

  const networks = ["ETH", "BSC", "POLYGON"];
  

  return (
    <div className="flex flex-col">
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
    </div>
  );
}
