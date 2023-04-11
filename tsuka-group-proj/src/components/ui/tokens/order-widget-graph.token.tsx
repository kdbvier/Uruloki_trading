import { ChartBound } from "@/types/chart-bound.type";
import { useMemo } from "react";

export const OrderWidgetGraph: React.FC<ChartBound> = ({
  buy,
  budgets,
  min,
  max,
}) => {
  const percents = useMemo(() => {
    const range = max - min;
    return budgets.map((value) => {
      return ((value - min) / range) * 90 + 10;
    });
  }, [budgets, min, max]);

  return (
    <div className="mb-4">
      <div className="px-4 py-2 border border-tsuka-400 text-tsuka-50">
        <p>{buy ? "BUY" : "SELL"}</p>
      </div>
      <div className="border border-tsuka-400 text-tsuka-100">
        <p
          className={`${
            buy ? "text-green-400" : "text-red-400"
          } mx-4 my-2 text-xs`}
        >
          Target Price
        </p>
        <div className="flex mt-4">
          <div
            className={`${
              buy ? "from-green-400/10" : "from-red-400/10"
            } w-full h-10 bg-gradient-to-t to-transparent relative`}
          >
            {percents.map((percent, index) => (
              <div
                key={index}
                className={`${
                  buy ? "border-green-400" : "border-red-400"
                } border-r-4 h-10 absolute ${!index && ""}`}
                style={{
                  width: `${percent}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
