import { useEffect, useRef, useState} from 'react';
import { createChart } from 'lightweight-charts';
import { getBitqueryOHLCData } from '../../lib/bitquery/getBitqueryOHLCData';
import { useAppDispatch, useAppSelector } from "@/store/hooks";


const BitqueryOHLCChart = () => {
  const chartRef = useRef();
  const barSeriesRef = useRef();
  const lineSeriesRef = useRef();
  const dispatch = useAppDispatch();
  const firstBitquery = useAppSelector((state) => state.bitquery.value);
  const streamValue = useAppSelector((state) => state.bitquery.streamValue);

  useEffect(() => {
    console.log("firstBitquery:::", firstBitquery);
    if (!chartRef.current) return;
    if (!firstBitquery) return;
    const chart = createChart(chartRef.current, {
      width: 1300,
      height: 400,
      layout: {
        background: {
          type: 'solid',
          color: '#222',
        },
        textColor: '#DDD',
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        // Vertical crosshair line (showing Date in Label)
        vertLine: {
          width: 8,
          color: '#C3BCDB44',
          style: LightweightCharts.LineStyle.Solid,
          labelBackgroundColor: '#9B7DFF',
        },

        // Horizontal crosshair line (showing Price in Label)
        horzLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
        },
      },
      rightPriceScale: {
        borderColor: '#71649C',
      },
      
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
      },
    });
    // lineSeries
    const lineSeries = chart.addLineSeries({
      color: '#26a69a',
      lineWidth: 2,
    });
    
    // Save the reference to the line series in a ref object
    lineSeriesRef.current = lineSeries;
    var mainSeries = chart.addBarSeries({
      thinBars: true,
      openVisible: true,
      downColor: '#ff4976',
      upColor: '#4bffb5',
    });
    
    barSeriesRef.current = mainSeries;
    var temp = [];
    var mainSeries1  = chart.addCandlestickSeries();
    // Changing the Candlestick colors
    mainSeries.applyOptions({
      wickUpColor: 'rgb(54, 116, 217)',
      upColor: 'rgb(54, 116, 217)',
      wickDownColor: 'rgb(225, 50, 85)',
      downColor: 'rgb(225, 50, 85)',
      borderVisible: false,
    }); 
    var tempTime;
    firstBitquery.map((value, key) => {
      var tempItem = {};
      if(tempTime == value["time"])
        return;
      console.log("tempTime:1",tempTime);

      Object.keys(value).forEach((key) => {
        tempItem[key] = value[key];
      })
      tempTime = tempItem["time"];
      console.log("tempTime:2",tempTime);
      temp.push(tempItem);
    })
    console.log("bitquery:::", temp);
    // mainSeries.setData(temp);
    temp.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);

      // Compare the dates
      return dateA - dateB;
    })
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });
    candlestickSeries.setData(temp);
    const lineData = temp.map(datapoint => ({
      time: datapoint.time,
      value: (datapoint.close + datapoint.open) / 2,
    }));
    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false, // hide the last value marker for this series
      crosshairMarkerVisible: false, // hide the crosshair marker for this series
      lineColor: 'transparent', // hide the line
      topColor: 'rgba(56, 33, 110,0.6)',
      bottomColor: 'rgba(56, 33, 110, 0.1)',
    });

    // Set the data for the Area Series
    areaSeries.setData(lineData);

    const data = [
      { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
      { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
      { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
      { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
      { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
      { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
      { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
      { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
      { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
      { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    ];

    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
      borderColor: '#71649C',
    });

    // Example of applying both properties in a single call
    chart.timeScale().applyOptions({
      borderColor: '#71649C',
      barSpacing: 10,
    });
    chart.timeScale().fitContent();

  //   var lastClose = data[data.length - 1].close;
  //   var lastIndex = data.length - 1;

  //   var targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
  //   var targetPrice = getRandomPrice();

  //   var currentIndex = lastIndex + 1;
  //   var currentBusinessDay = { day: 29, month: 5, year: 2019 };
  //   var ticksInCurrentBar = 0;
  //   var currentBar = {
  //     open: null,
  //     high: null,
  //     low: null,
  //     close: null,
  //     time: currentBusinessDay,
  //   };

  // function mergeTickToBar(price) {
  //   if (currentBar.open === null) {
  //     currentBar.open = price;
  //     currentBar.high = price;
  //     currentBar.low = price;
  //     currentBar.close = price;
  //   } else {
  //     currentBar.close = price;
  //     currentBar.high = Math.max(currentBar.high, price);
  //     currentBar.low = Math.min(currentBar.low, price);
  //   }
  //   mainSeries .update(currentBar);
  // }

  // function reset() {
  //   mainSeries .setData(data);
  //   lastClose = data[data.length - 1].close;
  //   lastIndex = data.length - 1;

  //   targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
  //   targetPrice = getRandomPrice();

  //   currentIndex = lastIndex + 1;
  //   currentBusinessDay = { day: 29, month: 5, year: 2019 };
  //   ticksInCurrentBar = 0;
  // }

  // function getRandomPrice() {
  //   return 10 + Math.round(Math.random() * 10000) / 100;
  // }

  // function nextBusinessDay(time) {
  //   var d = new Date();
  //   d.setUTCFullYear(time.year);
  //   d.setUTCMonth(time.month - 1);
  //   d.setUTCDate(time.day + 1);
  //   d.setUTCHours(0, 0, 0, 0);
  //   return {
  //     year: d.getUTCFullYear(),
  //     month: d.getUTCMonth() + 1,
  //     day: d.getUTCDate(),
  //   };
  // }

  // setInterval(function() {
  //   var deltaY = targetPrice - lastClose;
  //   var deltaX = targetIndex - lastIndex;
  //   var angle = deltaY / deltaX;
  //   var basePrice = lastClose + (currentIndex - lastIndex) * angle;
  //   var noise = (0.1 - Math.random() * 0.1) + 1.0;
  //   var noisedPrice = basePrice * noise;
  //   mergeTickToBar(noisedPrice);
  //   if (++ticksInCurrentBar === 5) {
  //     // move to next bar
  //     currentIndex++;
  //     currentBusinessDay = nextBusinessDay(currentBusinessDay);
  //     currentBar = {
  //       open: null,
  //       high: null,
  //       low: null,
  //       close: null,
  //       time: currentBusinessDay,
  //     };
  //     ticksInCurrentBar = 0;
  //     if (currentIndex === 5000) {
  //       reset();
  //       return;
  //     }
  //     if (currentIndex === targetIndex) {
  //       // change trend
  //       lastClose = noisedPrice;
  //       lastIndex = currentIndex;
  //       targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
  //       targetPrice = getRandomPrice();
  //     }
  //   }
  // }, 200);

    // Insert the resizing code here
    const updateChartSize = () => {
    const containerWidth = chartRef.current.clientWidth;
    const containerHeight = chartRef.current.clientHeight;
    const newWidth = containerWidth * 1;
    const newHeight = containerHeight * 1;
    chart.resize(newWidth, newHeight);
    };
    // const myPriceFormatter = p => p.toFixed(2);
    // Get the current users primary locale
    const currentLocale = window.navigator.languages[0];
    // Create a number format using Intl.NumberFormat
    const myPriceFormatter = Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency: 'USD', // Currency for data points
    }).format;
    // Apply the custom priceFormatter to the chart
    chart.applyOptions({
      localization: {
          priceFormatter: myPriceFormatter,
      },
    });

    // Adjust the options for the priceScale of the mainSeries
    mainSeries.priceScale().applyOptions({
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
    console.log("lineSeriesRef.current:",lineSeriesRef.current);
    console.log("streamValue:",streamValue.time);
    if (typeof(streamValue.time) == "undefined" || !lineSeriesRef.current) return;

    const updatedData = {
      time: streamValue.time,
      open: parseFloat(streamValue.open/19030),
      high: parseFloat(streamValue.high/19030),
      low: parseFloat(streamValue.low/19030),
      close: parseFloat(streamValue.close/19030),
    };
    // const updatedData = {
    //   time: streamValue.time,
    //   value: parseFloat(streamValue.close),
    // };
    const temp = [
      { time: '2023-05-04', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
      { time: '2023-05-04', open: 85.16, high: 92.84, low: 16.16, close: 75.72 },
    ];
    console.log("updateData:",updatedData);
    barSeriesRef.current.update(updatedData);
  }, [dispatch, streamValue]);

  return <div ref={chartRef}  />;
};

export default BitqueryOHLCChart;

