import { getTokenPosition } from "@/store/apps/token-positions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { FiltersButton } from "../ui/buttons/filters.button";

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

  const options = [
    {
      title: "All Positions",
      active: true,
    },
    {
      title: "Activity",
      active: false,
    },
  ];

  useEffect(() => {
    dispatch(getTokenPosition(token.id));
  }, [dispatch, token]);

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100">
      <div className="w-full flex items-center justify-start border-b border-tsuka-400 px-4 pt-2">
        {options.map(({ title, active }, index) => (
          <span
            key={index}
            className={`${
              active ? "border-b-2 border-accent" : ""
            } p-4 text-center mx-2 text-lg font-semibold text-tsuka-50`}
          >
            {title}
          </span>
        ))}
        <div className="ml-auto">
          <FiltersButton callback={() => console.log("filters button")} />
        </div>
      </div>
      {status === "loading" && "Loading..."}
      {status === "ok" && value && (
        <div className="p-4 flex">
          <div className="flex-1">
            <div className="h-96 overflow-auto">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {value?.sell?.positions?.map((item, index) => (
                <div
                  key={index}
                  className="text-red-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                >
                  <div className="absolute w-full rounded-lg m-2 mr-4">
                    <div
                      className="bg-red-400/20 h-6 rounded text-start flex items-center px-2 ml-auto mr-4"
                      style={{
                        width: `${item.depth}%`,
                      }}
                    ></div>
                  </div>
                  <span className="flex-1 py-2 px-4 font-normal">
                    $ {item.priceUsdt}
                  </span>
                  <span className="flex-1 py-2 px-4 text-end font-normal">
                    {item.amountBlur}
                  </span>
                  <span className="flex-1 py-2 px-4 text-end font-normal">
                    $ {value?.sell?.totalValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2" />
          <div className="flex-1">
            <div className="h-96 overflow-auto">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {value?.buy?.positions?.map((item, index) => (
                <div
                  key={index}
                  className="text-green-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                >
                  <div className="absolute w-full rounded-lg m-2 mr-4">
                    <div
                      className="bg-green-400/20 h-6 rounded text-start flex items-center px-2 mr-auto"
                      style={{
                        width: `${item.depth}%`,
                      }}
                    ></div>
                  </div>
                  <span className="flex-1 py-2 px-4 font-normal">
                    $ {item.priceUsdt}
                  </span>
                  <span className="flex-1 py-2 px-4 text-end font-normal">
                    {item.amountBlur}
                  </span>
                  <span className="flex-1 py-2 px-4 text-end font-normal">
                    $ {value?.buy?.totalValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
