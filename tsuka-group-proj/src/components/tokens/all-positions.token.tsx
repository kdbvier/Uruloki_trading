import { getTokenPosition } from "@/store/apps/token-positions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { FiltersButton } from "../ui/buttons/filters.button";
import { BarBuySellToken } from "../ui/tokens/bar-buy-sell.token";

export interface AllPositionsTokenProps {
  token: {
    id: string;
    token: string;
  };
}

export const AllPositionsToken: React.FC<AllPositionsTokenProps> = ({
  token,
}) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.tokenPosition);

  useEffect(() => {
    dispatch(getTokenPosition(token.id));
  }, [dispatch, token]);

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100">
      {status === "loading" && "Loading..."}
      {status === "ok" && value && (
        <div className="w-full text-sm text-left text-tsuka-200">
          <div className="w-full flex items-center border-b border-tsuka-400 p-4">
            <p className="w-full text-lg font-semibold text-tsuka-50">
              All Positions
            </p>
            <FiltersButton callback={() => console.log("filters button")} />
          </div>
          <div className="w-full flex items-center border-b border-tsuka-400 p-4">
            <BarBuySellToken
              buyValue={value.totalBuyValue}
              sellValue={value.totalSellValue}
            />
          </div>
          <div className="h-96 overflow-auto p-4">
            <table className="w-full text-sm text-left text-tsuka-200">
              <thead className="text-sm text-tsuka-300 border-b border-tsuka-400">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Price (USD)
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Amount BLUR
                  </th>
                  <th scope="col" className="px-4 py-2">
                    $ Value at Execution
                  </th>
                </tr>
              </thead>
              <tbody>
                {value.positions?.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      item.type === "Buy" ? "text-green" : "text-red"
                    } border-b border-tsuka-400 text-tsuka-200 text-xs`}
                  >
                    <th
                      className={`${
                        item.type === "Buy" ? "text-green" : "text-red"
                      } p-4`}
                    >
                      {item.type}
                    </th>
                    <th
                      className={`${
                        item.type === "Buy" ? "text-green" : "text-red"
                      } p-4`}
                    >
                      {item.priceUsd}
                    </th>
                    <th
                      className={`${
                        item.type === "Buy" ? "text-green" : "text-red"
                      } p-4`}
                    >
                      {item.amountBlur}
                    </th>
                    <th
                      className={`${
                        item.type === "Buy" ? "text-green" : "text-red"
                      } p-4`}
                    >
                      ${item.executionValue}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
