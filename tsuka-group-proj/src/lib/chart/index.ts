import { Order, TokenPairInfo } from "@/types";
import { getBitqueryOHLCData } from "../bitquery/getBitqueryOHLCData";
import { getBitqueryStreamData1, transformData } from "../bitquery/getBitqueryStreamData";
import _ from "lodash";
import { IChartApi, ISeriesApi, LineStyle, createChart } from "lightweight-charts";
import { RefObject } from "react";

export const fetchData = async (pairAddress: string, tokenPairInfo: TokenPairInfo, setCandleStickTime: any, setFirstBitquery: any, setForwardTime: any, setDatas: any, time: number = 15) => {
    try {
      if (!pairAddress) {
        return;
      }
      if (!tokenPairInfo || _.isEmpty(tokenPairInfo)) {
        return;
      }
      const eachAddress = {
        base: tokenPairInfo.baseToken?.address,
        quote: tokenPairInfo.pairedToken?.address,
        pairAddress: pairAddress,
        time: time,
      };
      const responseData = await getBitqueryOHLCData(eachAddress);
      console.log("Response data:")
      console.log(responseData)
      const tranData = await transformData(responseData);
      setCandleStickTime(eachAddress.time);
      // getBitqueryStreamInfo(eachAddress.pairAddress);//////
      const resData = await getBitqueryStreamData1(
        eachAddress.pairAddress,
        setDatas
      );
      // const resData = await getBitqueryStreamData(eachAddress.pairAddress);
      // const compareTokenName = tokenPairInfo.baseToken.symbol;
      // const resTranData = await transformStreamData(resData, compareTokenName);

      setFirstBitquery(tranData);
      setForwardTime(tranData[tranData.length - 1]?.time + 15 * 60 * 1000);
    } catch (err) {
      console.error(err);
    }
};

export const getUpdatedData = (forTime: string, datas: any, candleStickTime: number) => {
    if (datas[datas.length - 1].time > forTime) {
      const filterData = datas.filter((data: any) => data.time > forTime);
      const time = forTime + (candleStickTime * 60 * 1000 - 900000);
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
        (data: any) => parseInt(forTime) - candleStickTime * 60 * 1000 < data.time
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


export const createLightweightChart = (chartRef: HTMLDivElement): IChartApi => {
    return createChart(chartRef, {
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
          priceFormatter: (price: any) => {
            
            return (price).toFixed(14).padEnd(10);
          },
        },
        timeScale: {
          tickMarkFormatter: (businessDayOrTimestamp: any) => {
            console.log("businessDayOrTimestamp", businessDayOrTimestamp);
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
}

export const addMarkers = (activeOrdersByTokenpair: Array<Order>, candlestickSeries: ISeriesApi<"Candlestick">) => {
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

export const updateChartSize = (chartRef: HTMLDivElement, chart: IChartApi) => {
    console.log(chartRef)
    console.log(chart)
    new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartRef) { return; }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    }).observe(chartRef);
};