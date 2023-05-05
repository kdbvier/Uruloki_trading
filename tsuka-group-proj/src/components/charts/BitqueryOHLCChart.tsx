import { useEffect, useRef, useState} from 'react';
import { createChart, ISeriesApi, CandlestickData  } from 'lightweight-charts';
import { getBitqueryOHLCData } from '../../lib/bitquery/getBitqueryOHLCData';
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// price label bg color #f03349
// time label bg color #363a45
// down color #d83045
// up color #179981
// average line color #199a82
const getUpdatedData = (forTime:any, datas:any) => {
  const filterData = datas.filter((data:any) => data.time < forTime);
  const time = forTime;
  const open = filterData[0].open;
  const close = filterData[filterData.length - 1].close;
  const high = filterData.length !== 0 ? Math.max(...filterData.map((item:any) => item.high)) : "";

  const low = filterData.length !== 0 ? Math.max(...filterData.map((item:any) => item.low)) : "";

  return {
    time,
    open,
    high,
    low,
    close
  }
}
const BitqueryOHLCChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const barSeriesRef = useRef<ISeriesApi<'Bar'> | null>(null);
  const dispatch = useAppDispatch();
  const firstBitquery = useAppSelector((state) => state.bitquery.value);
  const streamValue = useAppSelector((state) => state.bitquery.streamValue);
  const forwardTime = useAppSelector((state) => state.bitquery.forwardTime);

  useEffect(() => {
    console.log("firstBitquery:::", firstBitquery);
    if (!chartRef.current) return;
    if (!firstBitquery) return;
    const chart = createChart(chartRef.current, {
        width: 1300,
        height: 400,
        layout: {
          background: {
            // type: 'solid',
            color: '#151924',
          },
          textColor: '#abacb1',
        },
        crosshair: {
          // mode: LightweightCharts.CrosshairMode.Normal,
          vertLine: {
            // width: 8,
            color: '#474a55',
            // style: LightweightCharts.LineStyle.Solid,
            labelBackgroundColor: '#474a55',
          },
          horzLine: {
            color: '#363a45',
            labelBackgroundColor: '#363a45',
          },
        },
        // PriceRange: {
        //   minValue: 0,
        // },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.5)',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.1)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.1)',
          },
        },
        localization: {
          timeFormatter: (businessDayOrTimestamp: any) => {
            return new Date(businessDayOrTimestamp).toLocaleString();
          },
        },
        timeScale: {
          tickMarkFormatter: (businessDayOrTimestamp: any) => {
            const date = new Date(businessDayOrTimestamp * 1000);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            return timeString;
          },
        },
      });
    // Save the reference to the line series in a ref object
    var barSeries = chart.addBarSeries({
      thinBars: true,
      downColor: '#ff4976',
      upColor: '#4bffb5',
    });
    barSeriesRef.current = barSeries;
    // Changing the Candlestick colors
    barSeries.applyOptions({
      // wickUpColor: '#179981',
      upColor: '#179981',
      // wickDownColor: '#d83045',
      downColor: '#d83045',
      // borderVisible: false,
    }); 
    interface MyCandlestickData extends CandlestickData {
      [key: string]: any;
    }
    
    
    let temp: MyCandlestickData[] = [];

    let tempTime: any = [];
    firstBitquery.map((value: Record<string, any>, key: number) => {
      let tempItem: MyCandlestickData = {
        time: "",
        open: 0,
        high: 0,
        low: 0,
        close: 0
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
    console.log("bitquery:::", temp);
    temp.sort((a: Record<string, any>, b: Record<string, any>) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
    
      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });
    
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(temp);
    
    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false, // hide the last value marker for this series
      crosshairMarkerVisible: false, // hide the crosshair marker for this series
      lineColor: 'transparent', // hide the line
      topColor: 'rgba(56, 33, 110,0.6)',
      bottomColor: 'rgba(56, 33, 110, 0.1)',
    });

    chart.timeScale().fitContent();

    // Insert the resizing code here
    const updateChartSize = () => {

      const containerWidth: number = chartRef.current?.clientWidth ?  chartRef.current?.clientWidth : 0;
      const containerHeight:number = chartRef.current?.clientHeight ? chartRef.current?.clientHeight : 0;

      const newWidth = containerWidth * 1;
      const newHeight = containerHeight * 1;

      chart.resize(newWidth, newHeight);
    };
    // const myPriceFormatter = p => p.toFixed(2);
    // Get the current users primary locale
    const currentLocale = window.navigator.languages[0];
    // Create a number format using Intl.NumberFormat
    // const myPriceFormatter = Intl.NumberFormat(currentLocale, {
    //     style: 'currency',
    //     currency: 'USD', // Currency for data points
    // }).format;
    // Apply the custom priceFormatter to the chart
    // chart.applyOptions({
    //   localization: {
    //       priceFormatter: myPriceFormatter,
    //   },
    // });

    // Adjust the options for the priceScale of the mainSeries
    barSeries.priceScale().applyOptions({
      autoScale: false, // disables auto scaling based on visible content
      scaleMargins: {
          top: 0.1,
          bottom: 0.2,
      },
    });
    // Initial size update
    updateChartSize();

    // Update size on window resize
    window.addEventListener('resize', updateChartSize);
    return () => {
      chart.remove();
      window.removeEventListener('resize', updateChartSize);
    };
  }, [dispatch, firstBitquery]);

  useEffect(() => {
    console.log("useEffect",streamValue);
    console.log("barSeriesRef",barSeriesRef);
    if (streamValue.length == 0 || !barSeriesRef.current) return;
    
    // const updatedData = {
    //   time: streamValue.time,
    //   open: parseFloat(streamValue.open),
    //   high: parseFloat(streamValue.high),
    //   low: parseFloat(streamValue.low),
    //   close: parseFloat(streamValue.close),
    // };
    console.log("inner");

    const updatedData = getUpdatedData(forwardTime, streamValue);
    console.log("updatedData",updatedData);

    // barSeriesRef.current?.update(updatedData);
    barSeriesRef.current.update(updatedData);
  }, [dispatch, streamValue, forwardTime]);

  return <div ref={chartRef}  />;
};

export default BitqueryOHLCChart;

