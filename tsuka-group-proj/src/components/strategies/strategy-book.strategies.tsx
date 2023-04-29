import { Strategy } from "@/types/strategy.type";
import { useCallback, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { DefaultButton } from "../ui/buttons/default.button";
import { FiltersButton } from "../ui/buttons/filters.button";
import { FiltersSearch } from "../ui/content-header/filters.search";
import { StatusSpan } from "../ui/spans/status.span";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";
import { SidebarStrategies } from "./sidebar.strategies";

export interface StrategyBookStrategiesProps {
  strategies: Array<Strategy>;
}

export const StrategyBookStrategies: React.FC<StrategyBookStrategiesProps> = ({
  strategies,
}) => {
  const [selectedPath, setSelectedPath] = useState("strategies-list");
  const [focusStrategy, setFocusStrategy] = useState<Strategy | null>(null);

  const options = [
    {
      title: "List of Strategies",
      path: "strategies-list",
    },
  ];

  const handleFocusStrategy = useCallback(
    (strategyId?: string) => {
      if (!strategyId || (focusStrategy && focusStrategy.id === strategyId)) {
        setFocusStrategy(null);
      } else {
        setFocusStrategy(strategies.find((item) => item.id === strategyId)!);
      }
    },
    [focusStrategy, strategies]
  );

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100">
      <div className="w-full flex items-center justify-start px-2 pt-2">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() => setSelectedPath(path)}
            className={`p-4 text-center mx-2 text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        <div className="ml-auto flex w-full md:w-auto items-center gap-3">
          <FiltersSearch />
          <FiltersButton callback={() => console.log("filters button")} />
        </div>
      </div>
      <div>
        {strategies && (
          <div className="p-4 flex">
            <div className="flex-1">
              <table className="overflow-auto w-full">
                <thead className="text-sm text-left font-normal text-tsuka-300 border-b border-tsuka-400">
                  <tr>
                    <th scope="col" className="px-4 py-2">
                      #
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Strategy Title
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Chains
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Created on
                    </th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {strategies?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b align-top border-tsuka-400 text-base w-full text-left"
                    >
                      <th
                        scope="row"
                        className="w-4 py-2 px-4 text-sm font-normal whitespace-nowrap"
                      >
                        #{item.id}
                      </th>
                      <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        {item.title}
                      </td>
                      <td className="rows-2 py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        {item.orderTokens?.map(
                          ({ network, name1, name2, code1, code2 }, index) => (
                            <div
                              key={index}
                              className="flex text-tsuka-200 items-center font-medium py-1"
                            >
                              <HorizontalIconsToken
                                inputToken={{ name: name1, code: code1 }}
                                outputToken={{ name: name2, code: code2 }}
                              />
                              <span className="text-tsuka-50 font-semibold text-base">
                                {code1}/
                                <span className="text-tsuka-200 text-sm">
                                  {code2}
                                </span>
                              </span>
                              <span className="ml-4">{network}</span>
                            </div>
                          )
                        )}
                      </td>
                      <td className="rows-2 py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        {item.orderTokens?.map(({ status }, index) => (
                          <StatusSpan key={index} status={status} />
                        ))}
                      </td>
                      <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        {item.createdAt}
                      </td>
                      <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        <DefaultButton
                          label="See details"
                          callback={() => handleFocusStrategy(item.id)}
                          RightIcon={MdArrowForward}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <SidebarStrategies
        open={!!focusStrategy}
        handleOpen={handleFocusStrategy}
        strategy={focusStrategy!}
      />
    </div>
  );
};
