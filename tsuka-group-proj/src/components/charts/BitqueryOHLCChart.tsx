import { useEffect, useRef} from 'react';
import { createChart, ISeriesApi, CandlestickData  } from 'lightweight-charts';
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// price label bg color #f03349
// time label bg color #363a45
// down color #d83045
// up color #179981
// average line color #199a82

// To subscribe get OHLC data from the Store
const getUpdatedData = (forTime: string, datas:any) => {
  const filterData = datas.filter((data:any) => data.time < forTime);
  const time = forTime;
  const open = filterData[0].open;
  const close = filterData[filterData.length - 1].close;
  const high = filterData.length !== 0 ? Math.max(...filterData.map((item:any) => item.high)) : 0;
  const low = filterData.length !== 0 ? Math.min(...filterData.map((item:any) => item.low)) : 0;

  return {
    time,
    open,
    high,
    low,
    close
  }
}

// This is our lightweight chart
const BitqueryOHLCChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const candleStickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const dispatch = useAppDispatch();
  const firstBitquery = useAppSelector((state) => state.bitquery.value);
  const streamValue = useAppSelector((state) => state.bitquery.streamValue);
  const forwardTime = useAppSelector((state) => state.bitquery.forwardTime);

  interface MyCandlestickData extends CandlestickData {
    [key: string]: any;
  }
  
  // When the first data arrives
  useEffect(() => {
    if (!chartRef.current || !firstBitquery) return;
    // create lightweight-chart
    const chart = createChart(chartRef.current, {
        width: 1300,
        height: 400,
        layout: {
          background: {
            color: '#151924',
          },
          textColor: '#abacb1',
        },
        crosshair: {
          vertLine: {
            color: '#474a55',
            labelBackgroundColor: '#474a55',
          },
          horzLine: {
            color: '#363a45',
            labelBackgroundColor: '#363a45',
          },
        },
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

    // In case existing wrong sort by time
    temp.sort((a: Record<string, any>, b: Record<string, any>) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });
    
    // Add the candlestick to the chart
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });
    candleStickSeriesRef.current=candlestickSeries;
    // Set data to the chart
    candlestickSeries.setData(temp);
    chart.timeScale().fitContent();

    // Insert the resizing code here
    const updateChartSize = () => {

      const containerWidth: number = chartRef.current?.clientWidth ?  chartRef.current?.clientWidth : 0;
      const containerHeight:number = chartRef.current?.clientHeight ? chartRef.current?.clientHeight : 0;

      const newWidth = containerWidth * 1;
      const newHeight = containerHeight * 1;

      chart.resize(newWidth, newHeight);
    };
    updateChartSize();

    // Update size on window resize
    window.addEventListener('resize', updateChartSize);
    return () => {
      chart.remove();
      window.removeEventListener('resize', updateChartSize);
    };
  }, [dispatch, firstBitquery]);

  // When subscription data arrives
  useEffect(() => {
    if (streamValue.length == 0 || typeof(streamValue.length) == "undefined" || !candleStickSeriesRef.current) return;
    if(typeof(streamValue.length) == "undefined") return;
    let updatedData: MyCandlestickData | null= null;

    // Get the OHLC data from subscription data in the Store
    updatedData = getUpdatedData(forwardTime, streamValue);
    // Update the chart
    candleStickSeriesRef.current.update(updatedData);
  }, [dispatch, streamValue, forwardTime]);

  return <div ref={chartRef}  />;
};

export default BitqueryOHLCChart;

