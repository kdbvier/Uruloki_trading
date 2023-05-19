import { ContentHeader } from "@/components/ui/content-header/content-header.token";
import { MostBuyOrders } from "@/components/ui/most-buy-orders/most-buy-orders.token";
import { MostSellOrders } from "@/components/ui/most-sell-orders/most-sell-orders.token";
import { TopGainers } from "@/components/ui/top-gainers/top-gainers.token";
import { TopMoversTokens } from "@/components/ui/top-movers-tokens/top-movers-tokens.token";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import {
  MostBuyOrdersMapper,
  MostSellOrdersMapper,
  TopGainersMapper,
  TopMoversMapper,
} from "@/lib/mapper";
import { SidebarStrategies } from "@/components/strategies/sidebar.strategies";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import HomePageTokens from "@/lib/api/tokens";
import Strategies from "@/lib/api/strategies";
import { Strategy, Tokens } from "@/types";

let currentTranslateX: number = 0;

export async function getServerSideProps(){
  const tokens = await HomePageTokens.getTokens();
  const strategies = await Strategies.getStrategiesData();

  return {
    props: {tokens, strategies}
  }
}

export default function Home({tokens, strategies}:{tokens:Tokens, strategies:Strategy[]}) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const [value, setValue] = useState(tokens);
  const [status, setStatus] = useState(!tokens);

  useEffect(()=> {
    if(!tokens) {
      setStatus(true);
      HomePageTokens.getTokens().then(tokens_data => {
        setValue(tokens_data);
        setStatus(false);
      })
    }
  }, [tokens])

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

  useEffect(() => {
    if (value.mostBuyOrders?.length === 0) {
      const notify = () => toast.error("Failed to load MostBuyOrders Data!");
      notify();
    }
    if (value.mostSellOrders?.length === 0) {
      const notify = () => toast.error("Failed to load MostSellOrders Data!");
      notify();
    }
    if (value.topGainers?.length === 0) {
      const notify = () => toast.error("Failed to load TopGainers Data!");
      notify();
    }
    if (value.topMovers?.length === 0) {
      const notify = () => toast.error("Failed to load TopMovers Data!");
      notify();
    }
  }, [status]);

  // useEffect(() => {
  //   const container = document.getElementsByClassName("swipable-container")[0];
  //   container.addEventListener("touchstart", handleTouchStart, false);
  //   container.addEventListener("touchmove", handleTouchMove, false);
  //   container.addEventListener("touchend", handleTouchEnd, false);
  // }, []);

  return (
    <>
      <ToastContainer />
      {(status === true || _.isEmpty(value)) && (
        <LoadingBox
          title="Loading data"
          description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
        />
      )}
      {status === false && !_.isEmpty(value) && (
        <div className="px-4 md:px-10 pt-6 pb-8">
          <ContentHeader title="Homepage" className="w-full mb-6" />
          <div className="hidden md:flex md:gap-5">
            <TopGainers topGainers={TopGainersMapper(value.topGainers)} />
            <MostBuyOrders
              mostBuyOrders={MostBuyOrdersMapper(value.mostBuyOrders)}
            />
            <MostSellOrders
              mostSellOrders={MostSellOrdersMapper(value.mostSellOrders)}
            />
          </div>
          <div className="swipable-container w-screen -ml-4 overflow-hidden">
            <div ref={content} className="md:hidden w-[300%] -ml-[0px] flex">
              <div className="w-1/3 px-4">
                <TopGainers topGainers={TopGainersMapper(value.topGainers)} />
              </div>
              <div className="w-1/3 px-4">
                <MostBuyOrders
                  mostBuyOrders={MostBuyOrdersMapper(value.mostBuyOrders)}
                />
              </div>
              <div className="w-1/3 px-4">
                <MostSellOrders
                  mostSellOrders={MostSellOrdersMapper(value.mostSellOrders)}
                />
              </div>
            </div>
          </div>
          <div className="md:hidden mt-3 w-full h-[3px] flex gap-2">
            <div
              className={`h-full w-1/3 ${
                currentIdx == 0 ? "bg-custom-primary" : "bg-tsuka-500"
              } cursor-pointer`}
              onClick={() => {
                moveTo(0);
              }}
            ></div>
            <div
              className={`h-full w-1/3 ${
                currentIdx == 1 ? "bg-custom-primary" : "bg-tsuka-500"
              } cursor-pointer`}
              onClick={() => {
                moveTo(1);
              }}
            ></div>
            <div
              className={`h-full w-1/3 ${
                currentIdx == 2 ? "bg-custom-primary" : "bg-tsuka-500"
              } cursor-pointer`}
              onClick={() => {
                moveTo(2);
              }}
            ></div>
          </div>
          <div className="mt-4">
            <TopMoversTokens topMovers={TopMoversMapper(value.topMovers)} />
          </div>
          <div className="fixed z-10 bottom-4 right-4 bg-tsuka-300 text-tsuka-50 rounded-full text-sm font-normal whitespace-nowrap">
            <button
              type="button"
              onClick={() => setShowSidebar(true)}
              className="w-full text-center focus:outline-none rounded-full text-sm p-4 inline-flex justify-center items-center mr-2"
            >
              <label className="mr-2">
                <HiOutlineArrowLongLeft size={24} />
              </label>
              Order & Strategies
            </button>
          </div>
          <SidebarStrategies
            open={showSidebar}
            handleOpen={() => setShowSidebar(false)}
            strategies={strategies!}
          />
        </div>
      )}
    </>
  );
}
