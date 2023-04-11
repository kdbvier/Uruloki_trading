import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";
import { AllPositionsToken } from "@/components/tokens/all-positions.token";
import { CompareTokenChainToken } from "@/components/tokens/compare-token-chain.token";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { ContentHeader } from "@/components/ui/content-header/content-header.token";
import { TopGainers } from "@/components/ui/top-gainers/top-gainers.token";
import { MostBuyOrders } from "@/components/ui/most-buy-orders/most-buy-orders.token";
import { MostSellOrders } from "@/components/ui/most-sell-orders/most-sell-orders.token";

export default function Home() {
  const titles = formItensData;
  const data = tokensData;
  const [inputToken, outputToken] = data.map((token) => {
    return { id: token.id, token: token.chain.code, icon: token.chain.icon };
  });

  const networks = ["ETH", "BSC", "POLYGON"];
  const tokens = [
    {
      token: {
        id: "bitcoin",
        name: "Bitcoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      price: 12503.83,
      risingPercent: 3.95,
      buyOrders: 100800,
      sellOrders: 125083,
    }, {
      token: {
        id: "polkadot",
        name: "Polkadot",
        shortName: "PKDT",
        imgUrl: "/tokens/polkadot.png",
      },
      price: 39402.77,
      risingPercent: 3.57,
      buyOrders: 39000,
      sellOrders: 40200,
    }, {
      token: {
        id: "anchor",
        name: "Anchor",
        shortName: "ANC",
        imgUrl: "/tokens/anchor.png",
      },
      price: 15590.74,
      risingPercent: 3.21,
      buyOrders: 15230,
      sellOrders: 15590,
    }, {
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      price: 3496.56,
      risingPercent: 3.11,
      buyOrders: 3800,
      sellOrders: 3496,
    },
  ];

  return (
    <div className="px-4 md:px-10 pt-6 pb-8">
      <ContentHeader title="Homepage" className="w-full mb-6"/>
      <div className="md:flex md:gap-5">
        <TopGainers tokens={tokens} />
        <MostBuyOrders tokens={tokens} />
        <MostSellOrders tokens={tokens} />
      </div>
    </div>
  );
}
