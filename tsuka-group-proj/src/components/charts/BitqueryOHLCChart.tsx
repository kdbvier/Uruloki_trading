import _ from "lodash";
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  LineStyle,
  createChart,
} from "lightweight-charts";
import { BitqueryData, Order, TokenPairInfo } from "@/types";
import { useRouter } from "next/router";
import {
  stopBitqueryStream,
} from "@/lib/bitquery/getBitqueryStreamData";
import Orders from "@/lib/api/orders";
import { useEffect, useRef, useState } from "react";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { addMarkers, createLightweightChart, fetchData, getUpdatedData, updateChartSize } from "@/lib/chart";
// price label bg color #f03349
// time label bg color #363a45
// down color #d83045
// up color #179981
// average line color #199a82

interface Props {
  onLoaded: () => void;
  tokenPairInfo: TokenPairInfo;
  setDataUnavailable: React.Dispatch<React.SetStateAction<boolean>>;
}

// This is our lightweight chart
const BitqueryOHLCChart: React.FC<Props> = ({ onLoaded, tokenPairInfo, setDataUnavailable }) => {
  const router = useRouter();
  const [pairAddress, setPairAddress] = useState(router.query.pair_id as string);
  const [activeOrdersByTokenpair, setActiveOrdersByTokenpair] = useState<
    Order[]
  >([]);

  useEffect(() => {
    const fetchTokenPairInfo_ActiveOrders = async () => {
      try {
        const walletAddress: string = (await getConnectedAddress()) as string;
        const res_1 = await Orders.getActiveOrdersbyTokenPair({
          tokenpair: pairAddress,
          walletAddress,
        });
        setActiveOrdersByTokenpair(res_1);
      } catch (err) {
        console.log("errors");
        console.error(err);
      }
    };
    fetchTokenPairInfo_ActiveOrders();
  }, [pairAddress]);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  let candleStickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [firstBitquery, setFirstBitquery] = useState<BitqueryData[]>([]);
  const [streamValue, setStreamValue] = useState<BitqueryData[]>([]);
  const [candleStickTime, setCandleStickTime] = useState<number>(15);
  const [forwardTime, setForwardTime] = useState<any>();
  const [wethPrice, setWethPrice] = useState<any>();

  const [active, setActive] = useState(15);
  const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  // create the WeakSet (probably store in your state somewhere)
  const chartRemoved = new WeakSet();
  const [chartState, setChartState] = useState<undefined | {
    chart: IChartApi;
    candleSeries: ISeriesApi<"Candlestick">;
  }>(undefined);

  const setDatas = (transData: {
    time: number;
    open: any;
    high: string | number;
    low: string | number;
    close: any;
  }) => {
    let a = streamValue;
    setStreamValue([...a, transData]);
    if (transData.time > forwardTime) {
      setForwardTime(forwardTime + candleStickTime * 60 * 1000);
    }
  };
  const fetchWethPrice = async () => {
    // Insert the URL of your chosen API endpoint for fetching the WETH/USD price
    const WETH_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
    
    const response = await fetch(WETH_API_URL);
    const data = await response.json();
    return data.ethereum.usd;
  };
  useEffect(() => {
    fetchData(pairAddress, tokenPairInfo, setCandleStickTime, setFirstBitquery, setForwardTime, setDatas);
  
    const fetchWeth = async () => {
      try {
        // const walletAddress: string = (await fetchWethPrice()) as string;
        const wethPrice = await fetchWethPrice();
        console.log("wethPrice:", wethPrice)
        
        const base=tokenPairInfo.baseToken?.address;
        const pair=tokenPairInfo.pairedToken?.address;
        let isWETHPair = false;
        if(base && pair){
          isWETHPair = base.toLowerCase() === WETH_ADDRESS || pair.toLowerCase() === WETH_ADDRESS;
        }
        setWethPrice(1);
        if(isWETHPair)
          setWethPrice(wethPrice);
      } catch (err) {
        console.log("errors");
        console.error(err);
      }
    };
    fetchWeth();
  }, [tokenPairInfo]);
  
  // When this page becomes unmounted
  useEffect(() => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, []);

  useEffect(() => {
    onLoaded()
    console.log("First Bitquery:")
    console.log(firstBitquery)
    if(firstBitquery.length == 0) setDataUnavailable(true)
    else setDataUnavailable(false)
  }, [firstBitquery])

  interface MyCandlestickData extends CandlestickData {
    [key: string]: any;
  }

  const candleStickClicked = (stick: number) => {
    setActive(stick);
    if (!tokenPairInfo) return;
    console.log(stick);
    fetchData(pairAddress, tokenPairInfo, setCandleStickTime, setFirstBitquery, setForwardTime, setDatas, active);
  };

  useEffect(() => {
    //console.log("useEffect");
    if (!chartRef.current || !firstBitquery) return;
    const chart = createLightweightChart(chartRef.current);

    // the historical data from the Bitquery
    let temp: MyCandlestickData[] = [];
    // the time of last historical data in Store
    let tempTime: any = [];
    // manipuate the historical data for the chart
    firstBitquery.map((value: Record<string, any>, key: number) => {
      let tempItem: MyCandlestickData = {
        time: "",
        open: 0,
        high: 0,
        low: 0,
        close: 0,
      };
      if (tempTime === value["time"]) {
        return;
      }
      Object.keys(value).forEach((key: string) => {
        tempItem[key] = value[key];
      });
      tempTime = tempItem["time"];
      temp.push(tempItem);
    });

    // In case existing wrong sort by time
    temp.sort((a: Record<string, any>, b: Record<string, any>) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });

    // Add the candlestick to the chart
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceFormat: {
        type: 'custom',
        formatter: (price:any) => {
          
        },
        minMove: 0.00000000001,
      }
    });
    if(candlestickSeries)
      // update chart state 
      setChartState({ chart, candleSeries: candlestickSeries });
    candleStickSeriesRef.current = candlestickSeries;
    // let scaledData = temp.map((item) => ({
    //   ...item,
    //   open: item.open,
    //   high: item.high,
    //   low: item.low,
    //   close: item.close,
    // }));
    console.log("temp:",temp)

    let scaledData = temp.map((item) => ({
      ...item,
      open: item.open*wethPrice,
      high: item.high*wethPrice,
      low: item.low*wethPrice,
      close: item.close*wethPrice,
    }));
    console.log("scaledData:",scaledData)
    // Set data to the chart
    candlestickSeries.setData(scaledData);
    if (showMarkers) {
      addMarkers(activeOrdersByTokenpair, candlestickSeries)
    }
    chart.timeScale().fitContent();

    // Insert the resizing code here
    // updateChartSize(chartRef.current, chart);

    setChart(chart);
    // Update size on window resize
    window.addEventListener("resize", () => {
      if(chartRef.current === null) return;
      updateChartSize(chartRef.current, chart)
      // new ResizeObserver(entries => {
      //   if (entries.length === 0 || entries[0].target !== chartRef.current) { return; }
      //   const newRect = entries[0].contentRect;
      //   chart.applyOptions({ height: newRect.height, width: newRect.width });
      // }).observe(chartRef.current);
    });
     // Make Chart Responsive with screen resize
    
    // When this page becomes unmounted
    return () => {
      console.log("removed")
      window.removeEventListener("resize", () => {
        if(chartRef.current === null) return;
        updateChartSize(chartRef.current, chart)
      });
      chart.remove();
      chartRemoved.add(chart);
      setChartState(undefined);
    };
  }, [firstBitquery, activeOrdersByTokenpair, showMarkers, candleStickTime]);
  
  // When subscription data arrives
  useEffect(() => {
    if (
      streamValue.length == 0 ||
      typeof streamValue.length == "undefined" ||
      !candleStickSeriesRef.current
    )
      return;
    if (typeof streamValue.length == "undefined") return;
    let updatedData: MyCandlestickData | null = null;
    // Get the OHLC data from subscription data in the Store
    updatedData = getUpdatedData(forwardTime, streamValue, candleStickTime);

    // Update the chart
    candleStickSeriesRef.current.update(updatedData);
  }, [streamValue, forwardTime]);
  console.log("tokenPairInfo",tokenPairInfo);
  return (
    <>
      <div ref={chartRef} />
      <div className="mt-2 border border-[rgba(67,70,81,1)] rounded-xl w-[230px] flex flex-row justify-around">
        <div className="-mr-[3px] -ml-[3px] w-full">
          <button
            onClick={() => candleStickClicked(15)}
            className={`${
              active === 15 ? "bg-[rgba(51,150,255,1)]" : ""
            } m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}
          >
            15M
          </button>
          <button
            onClick={() => candleStickClicked(30)}
            className={`${
              active === 30 ? "bg-[rgba(51,150,255,1)]" : ""
            } m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}
          >
            30M
          </button>
          <button
            onClick={() => candleStickClicked(60)}
            className={`${
              active === 60 ? "bg-[rgba(51,150,255,1)]" : ""
            } m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}
          >
            1H
          </button>
          <button
            onClick={() => candleStickClicked(360)}
            className={`${
              active === 360 ? "bg-[rgba(51,150,255,1)]" : ""
            } m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}
          >
            6H
          </button>
        </div>
      </div>
    </>
  );
};

export default BitqueryOHLCChart;
