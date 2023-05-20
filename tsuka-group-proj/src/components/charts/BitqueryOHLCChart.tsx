import _ from 'lodash'
import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ISeriesApi,
  CandlestickData,
  LineStyle,
  IChartApi
} from "lightweight-charts";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BitqueryData, Order, TokenPairInfo } from "@/types";
import { getBitqueryOHLCData } from "@/lib/bitquery/getBitqueryOHLCData";
// import { getBitqueryInitInfo, getBitqueryStreamInfo } from "@/store/apps/bitquery-data";
import { useRouter } from "next/router";
import HomePageTokens from "@/lib/api/tokens";
import { getBitqueryStreamData, getBitqueryStreamData1, stopBitqueryStream, transformData, transformStreamData } from '@/lib/bitquery/getBitqueryStreamData';
import Orders from '@/lib/api/orders';
// price label bg color #f03349
// time label bg color #363a45
// down color #d83045
// up color #179981
// average line color #199a82

// To subscribe, get OHLC data from the Store
const getUpdatedData = (forTime: string, datas: any, candleStickTime: number) => {
  if (datas[datas.length - 1].time > forTime) {
    const filterData = datas.filter((data: any) => data.time > forTime);
    const time = forTime + (candleStickTime*60*1000 - 900000);
    const open = filterData[0].open;
    const close = filterData[filterData.length - 1].close;
    const high =
      filterData.length !== 0
        ? Math.max(...filterData.map((item: any) => item.high))
        : 0;
    const low =
      filterData.length !== 0
        ? Math.min(...filterData.map((item: any) => item.low))
        : 0;
    return {
      time,
      open,
      high,
      low,
      close,
    };
  } else {
    const filterData1 = datas.filter((data: any) => data.time < forTime);
    const filterData = filterData1.filter(
      (data: any) => parseInt(forTime) - candleStickTime*60*1000 < data.time
    );
    const time = forTime;
    const open = filterData[0]?.open;
    const close = filterData[filterData.length - 1]?.close;
    const high =
      filterData.length !== 0
        ? Math.max(...filterData.map((item: any) => item.high))
        : 0;
    const low =
      filterData.length !== 0
        ? Math.min(...filterData.map((item: any) => item.low))
        : 0;

    return {
      time,
      open,
      high,
      low,
      close,
    };
  }
};
const scaleFactor = 1e15;

// export interface BitqueryOHLCChartProps {
//   tokenPairInfo: TokenPairInfo;
//   pairAddress: string;
// }

// This is our lightweight chart
const BitqueryOHLCChart = () => {
  const [pairAddress, setPairAddress] = useState("");
  const router = useRouter();
  useEffect(() => {
    setPairAddress(String(router.query.pair_id));
  }, [router]);
  const [tokenPairInfo, setTokenPairInfo] = useState<TokenPairInfo>();
  const [activeOrdersByTokenpair, setActiveOrdersByTokenpair] = useState<Order[]>([]);
  useEffect(()=>{
    const fetchTokenPairInfo_ActiveOrders = async () => {
      try {
        if(!pairAddress || _.isEmpty(pairAddress))
          return;
        const res = await HomePageTokens.getTokenPairInfo(pairAddress);
        setTokenPairInfo({...res});
        const res_1 = await Orders.getActiveOrdersbyTokenPair(pairAddress);
        setActiveOrdersByTokenpair(res_1);
      } catch (err) {
        console.log("errors");
        console.error(err);
      }
    };
    fetchTokenPairInfo_ActiveOrders();
  }, [pairAddress])
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  let candleStickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [firstBitquery, setFirstBitquery] = useState<BitqueryData[]>([]);
  const [streamValue, setStreamValue] = useState<BitqueryData[]>([]);
  const [candleStickTime, setCandleStickTime] = useState<number>(15);
  const [forwardTime, setForwardTime] = useState<any>();

  // const dispatch = useAppDispatch();
  // const firstBitquery = useAppSelector((state) => state.bitquery.value);
  // const streamValue = useAppSelector((state) => state.bitquery.streamValue);
  // const candleStickTime = useAppSelector((state) => state.bitquery.candleStickTime);
  // const forwardTime = useAppSelector((state) => state.bitquery.forwardTime);
  // const activeOrdersByTokenpair = useAppSelector(
  //   (state) => state.tokenpairOrders.value.orders
  // );
  // const pairAddress = useAppSelector(
  //   (state) => state.tokenpairOrders.value.pair_address
  // );
  // const tokenPairInfo = useAppSelector(
  //   (state) => state.tokenPairInfo.value
  // );
  const [active, setActive] = useState(15);

  const setDatas = (transData: {
    time: number;
    open: any;
    high: string | number;
    low: string | number;
    close: any;
  }) => {
    let a = streamValue;
    setStreamValue([...a, transData]);
    if(transData.time>forwardTime) {
      setForwardTime(forwardTime+candleStickTime*60*1000);
    }
  }
  const fetchData = async (time:number = 15) => {
    try{
      const pairAddress = router.query.pair_id;
      if(!pairAddress){
        return;
      }
      if(!tokenPairInfo || _.isEmpty(tokenPairInfo)){
        return;
      }
      const eachAddress = {
        base: tokenPairInfo.baseToken.address,
        quote: tokenPairInfo.pairedToken.address,
        pairAddress: pairAddress,
        time: time
      }
      const responseData = await getBitqueryOHLCData(eachAddress);
      const tranData = await transformData(responseData);
      setCandleStickTime(eachAddress.time);
      // getBitqueryStreamInfo(eachAddress.pairAddress);//////
      const resData = await getBitqueryStreamData1(eachAddress.pairAddress, setDatas);
      // const resData = await getBitqueryStreamData(eachAddress.pairAddress);
      // const compareTokenName = tokenPairInfo.baseToken.symbol;
      // const resTranData = await transformStreamData(resData, compareTokenName);


      setFirstBitquery(tranData);
      setForwardTime(tranData[tranData.length - 1]?.time + 15*60*1000)

    } catch(err){
      console.error(err);
    }
  }
  useEffect(()=>{
    fetchData();

  }, [tokenPairInfo])
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
  
  const candleStickClicked = (stick:number) => {
    setActive(stick);
    if(!tokenPairInfo)
      return;
    console.log(stick);
    // const eachAddress = {
    //   base: tokenPairInfo.baseToken.address,
    //   quote: tokenPairInfo.pairedToken.address,
    //   pairAddress: pairAddress,
    //   time: stick
    // }
    // console.log(eachAddress);
    // dispatch(getBitqueryInitInfo(eachAddress));
    fetchData(active);
  }
  
  useEffect(() => {
    console.log("useEffect");
    if (!chartRef.current || !firstBitquery) return;
    const chart = createChart(chartRef.current, {
      width: 1300,
      height: 400,
      layout: {
        background: {
          color: "#151924",
        },
        textColor: "#abacb1",
      },
      crosshair: {
        vertLine: {
          color: "#474a55",
          labelBackgroundColor: "#474a55",
        },
        horzLine: {
          color: "#363a45",
          labelBackgroundColor: "#363a45",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(197, 203, 206, 0.5)",
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.1)",
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.1)",
        },
      },
      localization: {
        timeFormatter: (businessDayOrTimestamp: any) => {
          return new Date(businessDayOrTimestamp).toLocaleString();
        },
        priceFormatter: (price:any) => {
          return (price / scaleFactor).toFixed(10); // Scale the price back down for display
        },
      },
      timeScale: {
        tickMarkFormatter: (businessDayOrTimestamp: any) => {
          console.log("businessDayOrTimestamp",businessDayOrTimestamp);
          const date = new Date(businessDayOrTimestamp);
          console.log("date", date);
          const hours = date.getHours().toString().padStart(2, "0");
          console.log("hours", date);

          const minutes = date.getMinutes().toString().padStart(2, "0");
          console.log("minutes", date);

          const timeString = `${hours}:${minutes}`;
          return timeString;
        },
      },
    });
    // create lightweight-chart

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
    let scaledData = temp.map(item => ({
      ...item,
      open: item.open * scaleFactor,
      high: item.high * scaleFactor,
      low: item.low * scaleFactor,
      close: item.close * scaleFactor,
    }));
    // Set data to the chart
    candlestickSeries.setData(scaledData);
    if (showMarkers) {
      activeOrdersByTokenpair?.map(
        ({
          budget,
          price_type,
          order_type,
          baseTokenShortName,
          single_price,
          from_price,
          to_price,
        }: Order) => {
          if (price_type === "single") {
            candlestickSeries.createPriceLine({
              price: single_price as number,
              color: order_type === "sell" ? "red" : "green",
              lineWidth: 1,
              lineStyle: LineStyle.Dotted,
              axisLabelVisible: true,
              title: `${(
                order_type as string
              ).toUpperCase()} ${budget} ${baseTokenShortName}`,
            });
          } else {
            candlestickSeries.createPriceLine({
              price: from_price as number,
              color: order_type === "sell" ? "yellow" : "purple",
              lineWidth: 1,
              lineStyle: LineStyle.Dotted,
              axisLabelVisible: true,
              title: `${(
                order_type as string
              ).toUpperCase()} ${budget} ${baseTokenShortName}`,
            });
            candlestickSeries.createPriceLine({
              price: to_price as number,
              color: order_type === "sell" ? "red" : "green",
              lineWidth: 1,
              lineStyle: LineStyle.Dotted,
              axisLabelVisible: true,
              title: `${(
                order_type as string
              ).toUpperCase()} ${budget} ${baseTokenShortName}`,
            });
          }
        }
      );
    }
    chart.timeScale().fitContent();
    
    // Insert the resizing code here
    const updateChartSize = () => {
      const containerWidth: number = chartRef.current?.clientWidth
        ? chartRef.current?.clientWidth
        : 0;
      const containerHeight: number = chartRef.current?.clientHeight
        ? chartRef.current?.clientHeight
        : 0;

      const newWidth = containerWidth * 1;
      const newHeight = containerHeight * 1;

      chart.resize(newWidth, newHeight);
    };
    updateChartSize();
    setChart(chart);
    // Update size on window resize
    window.addEventListener("resize", updateChartSize);
    return () => {
      chart.remove();
      window.removeEventListener("resize", updateChartSize);
    };
  }, [ firstBitquery, activeOrdersByTokenpair, showMarkers,candleStickTime]);

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
  }, [ streamValue, forwardTime]);
  
  // When subscription data arrives
  useEffect(() => {
    
  }, []);

  return (
    <>
      <div ref={chartRef} />
        <div className="mt-2 border border-[rgba(67,70,81,1)] rounded-xl w-[230px] flex flex-row justify-around">
          <div className="-mr-[3px] -ml-[3px] w-full">
          <button onClick={() => candleStickClicked(15)} className={`${active === 15 ? 'bg-[rgba(51,150,255,1)]' : ''} m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}>15M</button>
          <button onClick={() => candleStickClicked(30)} className={`${active === 30 ? 'bg-[rgba(51,150,255,1)]' : ''} m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}>30M</button>
          <button onClick={() => candleStickClicked(60)} className={`${active === 60 ? 'bg-[rgba(51,150,255,1)]' : ''} m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}>1H</button>
            <button onClick={() => candleStickClicked(360)} className={`${active === 360 ? 'bg-[rgba(51,150,255,1)]' : ''} m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] transition duration-300 text-white rounded-md `}>6H</button>
            {/* <button onClick={() => candleStickClicked(30)} className="m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-wide mb-[3px] focus:bg-[rgba(51,150,255,1)] transition duration-300 text-white rounded-md">30M</button>
            <button onClick={() => candleStickClicked(60)} className="m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-widest mb-[3px] focus:bg-[rgba(51,150,255,1)] transition duration-300 text-white rounded-md">1H</button>
            <button onClick={() => candleStickClicked(360)} className="m-[3px] pt-[4px] pb-[4px] w-[50px] tracking-widest mb-[3px] focus:bg-[rgba(51,150,255,1)] transition duration-300 text-white rounded-md">6H</button> */}
          </div>
      </div>
    </>
  );
};

export default BitqueryOHLCChart;
