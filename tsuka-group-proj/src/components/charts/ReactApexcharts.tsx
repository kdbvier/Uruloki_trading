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

const Chart = () => {
  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: ["4,250,1", "1,027.1"],
    colors: [donutColors.series1, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => val,
    },
    legend: {
      position: "bottom",
      markers: { offsetX: -5 },
      itemMargin: {
        vertical: 5,
        horizontal: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "1.2rem",
            },
            value: {
              fontSize: "1.2rem",
              formatter: (val: string) => val,
            },
            total: {
              show: true,
              fontSize: "1.4rem",
              label: "5,251,501",
              formatter: () => "Total Orders",
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1rem",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  return (
    <div className="bg-[#1F2333] rounded-md py-[21] px-[18.75 ] mb-3">
      <ReactApexcharts
        type="donut"
        height={300}
        options={options}
        series={[80, 20]}
      />
    </div>
  );
};

export default Chart;
