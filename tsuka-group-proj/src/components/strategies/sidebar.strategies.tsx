import { Strategy } from "@/types/strategy.type";
import Link from "next/link";
import { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { DefaultButton } from "../ui/buttons/default.button";
import { StatusSpan } from "../ui/spans/status.span";
import { TokenIconSpan } from "../ui/spans/token-icon.span";
import { TokenPairStrategies } from "../ui/strategies/token-pair.strategies";

export interface SidebarStrategiesProps {
  open: boolean;
  handleOpen: () => void;
  strategies: Array<Strategy>;
}

export const SidebarStrategies: React.FC<SidebarStrategiesProps> = ({
  open,
  handleOpen,
  strategies,
}) => {
  const [showExtraId, setShowExtraId] = useState<number | null>(null);
  return (
    <div
      className={
        open
          ? "w-full h-screen top-0 lef-0 bg-tsuka-700/60 fixed z-10 backdrop-blur-sm"
          : ""
      }
    >
      <div
        className={`${
          open ? "translate-x-0 right-4 md:right-8" : "translate-x-full right-0"
        } fixed top-0 z-40 h-screen p-6 overflow-y-auto shadow-xl transition-transform bg-tsuka-500 w-full md:w-[516px]`}
      >
        <div className="w-min whitespace-nowrap">
          <DefaultButton
            label="Hide Sidebar"
            callback={handleOpen}
            Icon={MdArrowForward}
          />
        </div>
        <div>
          <div className="text-tsuka-50 text-3xl">
            Order & Setups
            <span className="text-tsuka-200 text-lg ml-1">
              ({strategies?.length})
            </span>
          </div>
        </div>
        <div className="py-2">Showing list of setups</div>
        <div className="flex flex-col mt-4 gap-4">
          {strategies.map(({ id, orderTokens }) =>
            orderTokens?.map((item, index) => (
              <div
                key={index}
                className="border border-tsuka-200 p-2 rounded-md flex align-top"
              >
                <div className="flex flex-1 flex-col">
                  <Link href={`/strategies/${id}`}>
                    <div className="flex">
                      <div className="flex -space-x-3 mr-2">
                        <TokenIconSpan code={item.code1} name={item.name1} />
                        <TokenIconSpan code={item.code2} name={item.name2} />
                        {item.extraTokens && (
                          <span className="flex items-center justify-center w-7 h-7 text-xs font-medium text-tsuka-50 bg-tsuka-400 rounded-full">
                            +{item.extraTokens.length}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-tsuka-50 text-sm">
                          {item.extraTokens
                            ? "Avoid Strategy"
                            : `${item.code1}/${item.code2}`}
                        </span>
                        <span className="text-tsuka-200 text-xs">ID: {id}</span>
                      </div>
                    </div>
                  </Link>
                  {item.extraTokens && (
                    <div className="ml-2 px-2 border-l-2 text-sm border-accent text-accent border-dashed">
                      {showExtraId === index && (
                        <>
                          <div className="flex mt-2">
                            <TokenPairStrategies
                              id={id}
                              name1={item.name1}
                              code1={item.code1}
                              name2={item.name2}
                              code2={item.code2}
                            />
                          </div>
                          {item.extraTokens.map((extra) => (
                            <div key={extra.code} className="flex mt-2">
                              <TokenPairStrategies
                                id={id}
                                name1={item.name1}
                                code1={item.code1}
                                name2={extra.name}
                                code2={extra.code}
                              />
                            </div>
                          ))}
                        </>
                      )}
                      <span
                        onClick={() =>
                          setShowExtraId((prev) =>
                            prev === index ? null : index
                          )
                        }
                        className="cursor-pointer"
                      >
                        {showExtraId === index
                          ? ""
                          : `${2 + item.extraTokens.length} orders in strategy`}
                        <span className="text-xs font-light">
                          {showExtraId === index
                            ? "(Show less)"
                            : "(Click to see)"}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <StatusSpan status={item.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
