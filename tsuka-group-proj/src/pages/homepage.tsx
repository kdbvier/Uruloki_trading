import { ContentHeader } from "@/components/ui/content-header/content-header.token";
import { MostBuyOrders } from "@/components/ui/most-buy-orders/most-buy-orders.token";
import { MostSellOrders } from "@/components/ui/most-sell-orders/most-sell-orders.token";
import { TopGainers } from "@/components/ui/top-gainers/top-gainers.token";
import { TopMoversTokens } from "@/components/ui/top-movers-tokens/top-movers-tokens.token";
import { IMostBuyOrder, IMostSellOrder, ITopGainer, ITopMover } from "@/global";
import { useEffect, useRef, useState } from "react";
import HomePageTokens from "../lib/api/tokens";

let currentTranslateX: number = 0;

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  useEffect(() => {
    const temp = async () => {
      let res = await HomePageTokens.getTokens();
      console.log(res);
    };

    temp();
  });

  let content: any = useRef();
  let x1: number = 0;
  let x2: number = 0;

  const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };
  const moveTo = async (idx: number) => {
    let to: number = -window.innerWidth * idx;
    let delta = currentTranslateX >= to ? -10 : 10;
    while (Math.abs(currentTranslateX - to) > 11) {
      await delay(1);
      currentTranslateX += delta;
      content.current.style.transform = `translateX(${currentTranslateX}px)`;
    }
    currentTranslateX = to;
    content.current.style.transform = `translateX(${to}px)`;
    setCurrentIdx(idx);
  };

  const handleTouchStart = (event: any) => {
    x1 = event.touches[0].pageX;
  };
  const handleTouchMove = async (event: any) => {
    x2 = event.touches[0].pageX;
    let str: string = content.current.style.transform;
    if (str) {
      currentTranslateX = Number(str.slice(11, -3));
    } else currentTranslateX = 0;
    currentTranslateX += Math.floor(x2 - x1);
    content.current.style.transform = `translateX(${currentTranslateX}px)`;
    x1 = x2;
  };
  const handleTouchEnd = (event: any) => {
    let toIdx: number = 0;
    if (currentTranslateX >= window.innerWidth * -0.5) toIdx = 0;
    if (
      currentTranslateX >= window.innerWidth * -1.5 &&
      currentTranslateX < window.innerWidth * -0.5
    )
      toIdx = 1;
    if (currentTranslateX < window.innerWidth * -1.5) toIdx = 2;
    moveTo(toIdx);
  };

  const topGainers: ITopGainer[] = [
    {
      rank: 1,
      token: {
        id: "bitcoin",
        name: "Bitcoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      price: 12503.83,
      risingPercent: 3.95,
    },
    {
      rank: 2,
      token: {
        id: "polkadot",
        name: "Polkadot",
        shortName: "DOT",
        imgUrl: "/tokens/polkadot.png",
      },
      price: 39402.77,
      risingPercent: 3.57,
    },
    {
      rank: 3,
      token: {
        id: "anchor protocol",
        name: "Anchor",
        shortName: "ANC",
        imgUrl: "/tokens/anchor.png",
      },
      price: 15590.74,
      risingPercent: 3.21,
    },
    {
      rank: 4,
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      price: 3496.56,
      risingPercent: 3.11,
    },
    {
      rank: 5,
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      price: 3496.56,
      risingPercent: 3.11,
    },
  ];

  const mostBuyOrders: IMostBuyOrder[] = [
    {
      rank: 1,
      token: {
        id: "bitcoin",
        name: "Bitcoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      buyOrders: 100800,
    },
    {
      rank: 2,
      token: {
        id: "polkadot",
        name: "Polkadot",
        shortName: "DOT",
        imgUrl: "/tokens/polkadot.png",
      },
      buyOrders: 39000,
    },
    {
      rank: 3,
      token: {
        id: "anchor protocol",
        name: "Anchor",
        shortName: "ANC",
        imgUrl: "/tokens/anchor.png",
      },
      buyOrders: 15230,
    },
    {
      rank: 4,
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      buyOrders: 3800,
    },
    {
      rank: 5,
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      buyOrders: 3800,
    },
  ];

  const mostSellOrders: IMostSellOrder[] = [
    {
      rank: 1,
      token: {
        id: "bitcoin",
        name: "Bitcoin",
        shortName: "BTC",
        imgUrl: "/tokens/bitcoin.png",
      },
      sellOrders: 125083,
    },
    {
      rank: 2,
      token: {
        id: "polkadot",
        name: "Polkadot",
        shortName: "DOT",
        imgUrl: "/tokens/polkadot.png",
      },
      sellOrders: 40200,
    },
    {
      rank: 3,
      token: {
        id: "anchor protocol",
        name: "Anchor",
        shortName: "ANC",
        imgUrl: "/tokens/anchor.png",
      },
      sellOrders: 15590,
    },
    {
      rank: 4,
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      sellOrders: 3496,
    },
    {
      rank: 5,
      token: {
        id: "ethereum",
        name: "Ethereum",
        shortName: "ETH",
        imgUrl: "/tokens/ethereum.png",
      },
      sellOrders: 3496,
    },
  ];

  const topMoversTokens: ITopMover[] = [
    {
      id: 743,
      token: "SingleEarth",
      chain: {
        id: "BitCoin",
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
    },
    {
      id: 456,
      token: "DogeCoins",
      chain: {
        id: "BitCoin",
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
    },
    {
      id: 645,
      token: "USDTTether",
      chain: {
        id: "Ethereum",
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
    },
    {
      id: 563,
      token: "Shiba Inu",
      chain: {
        id: "Ethereum",
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
    },
    {
      id: 656,
      token: "SingleEarth",
      chain: {
        id: "BitCoin",
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
    },
    {
      id: 729,
      token: "DogeCoins",
      chain: {
        id: "BitCoin",
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
  ];

  useEffect(() => {
    const container = document.getElementsByClassName("swipable-container")[0];
    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchmove", handleTouchMove, false);
    container.addEventListener("touchend", handleTouchEnd, false);
  }, []);

  return (
    <div className="px-4 md:px-10 pt-6 pb-8">
      <ContentHeader title="Homepage" className="w-full mb-6" />
      <div className="hidden md:flex md:gap-5">
        <TopGainers topGainers={topGainers} />
        <MostBuyOrders mostBuyOrders={mostBuyOrders} />
        <MostSellOrders mostSellOrders={mostSellOrders} />
      </div>
      <div className="swipable-container w-screen -ml-4 overflow-hidden">
        <div ref={content} className="md:hidden w-[300%] -ml-[0px] flex">
          <div className="w-1/3 px-4">
            <TopGainers topGainers={topGainers} />
          </div>
          <div className="w-1/3 px-4">
            <MostBuyOrders mostBuyOrders={mostBuyOrders} />
          </div>
          <div className="w-1/3 px-4">
            <MostSellOrders mostSellOrders={mostSellOrders} />
          </div>
        </div>
      </div>
      <div className="md:hidden mt-3 w-full h-[3px] flex gap-2">
        <div
          className={`h-full w-1/3 ${
            currentIdx == 0 ? "bg-accent" : "bg-tsuka-500"
          } cursor-pointer`}
          onClick={() => {
            moveTo(0);
          }}
        ></div>
        <div
          className={`h-full w-1/3 ${
            currentIdx == 1 ? "bg-accent" : "bg-tsuka-500"
          } cursor-pointer`}
          onClick={() => {
            moveTo(1);
          }}
        ></div>
        <div
          className={`h-full w-1/3 ${
            currentIdx == 2 ? "bg-accent" : "bg-tsuka-500"
          } cursor-pointer`}
          onClick={() => {
            moveTo(2);
          }}
        ></div>
      </div>
      <div className="mt-4">
        <TopMoversTokens topMovers={topMoversTokens} />
      </div>
    </div>
  );
}
