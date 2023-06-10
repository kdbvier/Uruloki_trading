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
  tokenPairInfo: TokenPairInfo
}

// This is our lightweight chart
const BitqueryOHLCChart: React.FC<Props> = ({ onLoaded, tokenPairInfo }) => {
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

  const [active, setActive] = useState(15);

  const setDatas = (transData: {
    time: number;
    open: any;
    high: string | number;
    low: string | number;
    close: any;
  }) => {
    // let a = [...streamValue];
    // a.push(transData);
    // setStreamValue(a);
    // if(transData.close === '' || transData.open === '' ){
    //   return;
    // }
    if(Number.isNaN(transData.time)){
      
    } else {
      setStreamValue(prevStreamValue => [...prevStreamValue, transData]);
      // if (transData.time > forwardTime) {
      //   alert("forwarding time"  + transData.time + ", +  original forwardTime = " + forwardTime);
      //   setForwardTime(forwardTime + candleStickTime * 60 * 1000);
      // }

    }
  };
 
  useEffect(() => {
    console.log("0, inside useEffect: fetchData first invoke");
    fetchData(pairAddress, tokenPairInfo, setCandleStickTime, setFirstBitquery, setForwardTime, setDatas);
  }, [tokenPairInfo]);
  // When this page becomes unmounted
  useEffect(() => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, []);

  interface MyCandlestickData extends CandlestickData {
    [key: string]: any;
  }

  const candleStickClicked = async (stick: number) => {
    setCandleStickTime(stick);
    await setActive(stick);
    if (!tokenPairInfo) return;
    console.log(stick, active);
    fetchData(pairAddress, tokenPairInfo, setCandleStickTime, setFirstBitquery, setForwardTime, setDatas, stick);
  };

  useEffect(() => {
    console.log("useEffect");
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
    });
    candleStickSeriesRef.current = candlestickSeries;
    let scaledData = temp.map((item) => ({
      ...item,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
    // Set data to the chart
    candlestickSeries.setData(scaledData);
    if (showMarkers) {
      addMarkers(activeOrdersByTokenpair, candlestickSeries)
    }
    chart.timeScale().fitContent();

    // Insert the resizing code here
    updateChartSize(chartRef.current, chart);

    setChart(chart);
    // Update size on window resize
    window.addEventListener("resize", () => {
      if(chartRef.current === null) return;
      updateChartSize(chartRef.current, chart)
    });
    return () => {
      chart.remove();
      window.removeEventListener("resize", () => {
        if(chartRef.current === null) return;
        updateChartSize(chartRef.current, chart)
      });
    };
  }, [firstBitquery, activeOrdersByTokenpair, showMarkers, candleStickTime]);

  // When subscription data arrives
  useEffect(() => {
    console.log("3: subscription arrived:");
    console.log("3.1: forwardTime = ", forwardTime);
    console.log("3.2: streamValue = ", streamValue);
    console.log("3.3: candleStickTime", candleStickTime);
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
    console.log("4: updatedData = ", updatedData);
    setForwardTime((prevForwardTime: number)=>{
      // console.log("2, setDatas: transData ", transData, " transData.time=", transData.time, " forwardTime in state: ", prevForwardTime);
      console.log("4.0, ", prevForwardTime, "isUpdating forward=", updatedData && updatedData.time > prevForwardTime);

      if(updatedData && updatedData.time > prevForwardTime){
        
        return prevForwardTime + candleStickTime * 60 * 1000;
      } else {
        return prevForwardTime;
      }
    })
    // Update the chart
    candleStickSeriesRef.current.update(updatedData);
  }, [streamValue]);

  // When subscription data arrives
  useEffect(onLoaded, []);

  return (
    <>
      <div ref={chartRef} />
      <div className="mt-2 border border-[rgba(67,70,81,1)] rounded-xl w-[330px] flex flex-row justify-around">
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
          {/* <button onClick={() => candleStickClicked(30)} className="m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] focus:bg-[rgba(51,150,255,1)] transition duration-300 text-white rounded-md">30M</button>
            <button onClick={() => candleStickClicked(60)} className="m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-widest mb-[3px] focus:bg-[rgba(51,150,255,1)] transition duration-300 text-white rounded-md">1H</button>
            <button onClick={() => candleStickClicked(360)} className="m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-widest mb-[3px] focus:bg-[rgba(51,150,255,1)] transition duration-300 text-white rounded-md">6H</button> */}
        </div>
      </div>
    </>
  );
};

export default BitqueryOHLCChart;
