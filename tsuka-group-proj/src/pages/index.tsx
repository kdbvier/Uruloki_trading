import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";
import { IBenifitsItemFields, ILandingPage, INavbarFields } from "@/@types/generated/contentful.types";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { CompareTokenChainToken } from "@/components/tokens/compare-token-chain.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import getLandingPage from "@/lib/content-graphql";
import ContentService from "@/lib/content-service";

type newProps = {
  landingPages: ILandingPage[];
}
export default function Home({landingPages}: newProps){
  const titles = formItensData;
  const data = tokensData;
  const [inputToken, outputToken] = data.map((token) => {
    return { id: token.id, token: token.chain.code, icon: token.chain.icon };
  });

  console.log(landingPages);
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

export const getServerSideProps =async () => {
  const landingPageContents = await ContentService.instance.getEntriesByType<ILandingPage>("landingPage");
  const landingPages = landingPageContents.map(entry=>{
    return entry.fields;
  });

  // getLandingPage().then(response=> console.log("response GraphQL:: ", response));
  // console.log("Inside ServerSideProps", landingPages);
  return {props: {landingPages}}
}