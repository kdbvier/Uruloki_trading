"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexcharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const donutColors = {
  series1: "#6FCF97",
  series2: "#EB5757",
};

const chartData = {
  total: 5251501,
  active: 42501,
  out: 10211,
};

const changeString = (val: number) => {
  const res = val.toLocaleString();
  return res;
};

const Chart = () => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 150,
      width: "100%",
    },
    stroke: {
      width: 5,
      colors: ["#1F2333"],
    },
    plotOptions: {
      pie: {
        startAngle: 50,
        donut: {
          size: "85%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 38,
              formatter: () => "Total Orders",
            },
            value: {
              show: true,
              fontSize: "32px",
              fontFamily: "DM Sans",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
              offsetY: -10,
            },
            total: {
              show: true,
              showAlways: true,
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: "Open Sans",
              fontSize: "16px",
              fontWeight: 400,
              formatter: (val: string) => "5,251,501",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: ["Active", "Out of Funds"],
    legend: {
      show: false,
      position: "right",
      markers: { offsetX: 0 },
      itemMargin: {
        vertical: 0,
        horizontal: 0,
      },
    },

    colors: [donutColors.series1, donutColors.series2],
  };

  return (
    <div className="bg-[#1F2333] rounded-md py-[21] px-[18.75 ] mb-3 relative">
      <div className="mr-10">
        <ReactApexcharts
          type="donut"
          height={220}
          options={options}
          series={[80, 20]}
        />
      </div>
      <div className="flex flex-col absolute top-[55px] right-3">
        <div className="font-['DM Sans'] font-medium text-[10px] leading-[13px] text-[#6FCF97]">
          Active
        </div>
        <div className="font-['DM Sans'] font-medium text-[16px] leading-[21px] text-[#BBC3D7]">
          {changeString(chartData.active)}
        </div>
        <div className="font-['DM Sans'] font-medium text-[10px] leading-[13px] text-[#EB5757] mt-5">
          OUt Of Funds
        </div>
        <div className="font-['DM Sans'] font-medium text-[16px] leading-[21px] text-[#BBC3D7]">
          {changeString(chartData.out)}
        </div>
      </div>
    </div>
  );
};

export default Chart;
