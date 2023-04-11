import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";
import { ContentHeader } from "@/components/ui/content-header/content-header.token";
import { TopGainers } from "@/components/ui/top-gainers/top-gainers.token";
import { MostBuyOrders } from "@/components/ui/most-buy-orders/most-buy-orders.token";
import { MostSellOrders } from "@/components/ui/most-sell-orders/most-sell-orders.token";
import { TopMoversTokens } from "@/components/ui/top-movers-tokens/top-movers-tokens.token";
import { useState } from "react";

export default function Home() {
  const [currentBoard, setCurrentBoard] = useState<number>(0);
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
  const topMoversTokens = [
    {
      id: 743,
      token: "SingleEarth",
      chain: {
        name: "BitCoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      price: 12503.83,
      risingPercent: 6.95,
      volume: 13859000000000,
      marketCap: 675859000000000,
      orderCount: 3465000000,
      buyOrderCount: 2000,
      sellOrderCount: 150,
    }, {
      id: 456,
      token: "DogeCoins",
      chain: {
        name: "BitCoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      price: 12635.45,
      risingPercent: -6.45,
      volume: 13563000000000,
      marketCap: 504634000000000,
      orderCount: 4465000000,
      buyOrderCount: 2000,
      sellOrderCount: 500,
    }, {
      id: 645,
      token: "USDTTether",
      chain: {
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      price: 12474.24,
      risingPercent: 5.53,
      volume: 13536000000000,
      marketCap: 656859000000000,
      orderCount: 3536000000,
      buyOrderCount: 200,
      sellOrderCount: 1500,
    }, {
      id: 563,
      token: "Shiba Inu",
      chain: {
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      price: 12346.43,
      risingPercent: -3.25,
      volume: 13155000000000,
      marketCap: 504245000000000,
      orderCount: 3526000000,
      buyOrderCount: 2000,
      sellOrderCount: 1500,
    }, {
      id: 656,
      token: "SingleEarth",
      chain: {
        name: "BitCoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      price: 12345.83,
      risingPercent: 3.35,
      volume: 13452000000000,
      marketCap: 566859000000000,
      orderCount: 3663000000,
      buyOrderCount: 2000,
      sellOrderCount: 0,
    }, {
      id: 729,
      token: "DogeCoins",
      chain: {
        name: "BitCoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      price: 12302.63,
      risingPercent: 2.77,
      volume: 12097000000000,
      marketCap: 524689000000000,
      orderCount: 3392000000,
      buyOrderCount: 2000,
      sellOrderCount: 1500,
    },
  ]

  return (
    <div className="px-4 md:px-10 pt-6 pb-8">
      <ContentHeader title="Homepage" className="w-full mb-6"/>
      <div className="hidden md:flex md:gap-5">
        <TopGainers tokens={tokens} />
        <MostBuyOrders tokens={tokens} />
        <MostSellOrders tokens={tokens} />
      </div>
      <div className="md:hidden md:gap-5">
        {
          currentBoard == 0 &&
          <TopGainers tokens={tokens} />
        }
        {
          currentBoard == 1 &&
          <MostBuyOrders tokens={tokens} />
        }
        {
          currentBoard == 2 &&
          <MostSellOrders tokens={tokens} />
        }
      </div>
      <div className="md:hidden mt-3 w-full h-[3px] flex gap-2">
        <div className={`h-full w-1/3 ${currentBoard == 0 ? "bg-[#AF71FF]" : "bg-tsuka-500"} cursor-pointer`} onClick={() => {setCurrentBoard(0)}}></div>
        <div className={`h-full w-1/3 ${currentBoard == 1 ? "bg-[#AF71FF]" : "bg-tsuka-500"} cursor-pointer`} onClick={() => {setCurrentBoard(1)}}></div>
        <div className={`h-full w-1/3 ${currentBoard == 2 ? "bg-[#AF71FF]" : "bg-tsuka-500"} cursor-pointer`} onClick={() => {setCurrentBoard(2)}}></div>
      </div>
      <div className="mt-4">
        <TopMoversTokens tokens={topMoversTokens} />
      </div>
    </div>
  );
}
