import { Strategy } from "@/types/strategy.type";
import { MdArrowForward } from "react-icons/md";
import { DefaultButton } from "../ui/buttons/default.button";
import { StatusSpan } from "../ui/spans/status.span";
import { TokenIconSpan } from "../ui/spans/token-icon.span";

export interface SidebarStrategiesProps {
  open: boolean;
  handleOpen: () => void;
  strategy: Strategy;
}

export const SidebarStrategies: React.FC<SidebarStrategiesProps> = ({
  open,
  handleOpen,
  strategy,
}) => {
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
          open ? "translate-x-0 right-8" : "translate-x-full right-0"
        } fixed top-0 z-40 h-screen p-4 overflow-y-auto shadow-xl transition-transform bg-tsuka-500 w-[516px]`}
      >
        <div className="w-min whitespace-nowrap">
          <DefaultButton
            label="Hide Sidebar"
            callback={handleOpen}
            Icon={MdArrowForward}
          />
        </div>
        <div className="flex flex-col mt-4 gap-4">
          {strategy?.orderTokens?.map((item, index) => (
            <div
              key={index}
              className="border border-tsuka-200 p-2 rounded-md flex align-top"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex">
                  <div className="flex -space-x-3 mr-2">
                    <TokenIconSpan code={item.code1} name={item.name1} />
                    <TokenIconSpan code={item.code2} name={item.name2} />
                    {item.extraTokens && (
                      <span className="flex items-center justify-center w-7 h-7 text-xs font-medium text-tsuka-50 bg-tsuka-400 rounded-full">
                        {item.extraTokens.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-tsuka-50 text-sm">
                      {item.extraTokens
                        ? "Avoid Strategy"
                        : `${item.code1}/${item.code2}`}
                    </span>
                    <span className="text-tsuka-200 text-xs">
                      ID: {strategy?.id}
                    </span>
                  </div>
                </div>
                {item.extraTokens && (
                  <div className="ml-2 px-2 border-l-2 text-sm border-accent text-accent border-dashed">
                    {`${2 + item.extraTokens.length} tokens in strategy`}
                    <span className="text-xs font-light">(Click to see)</span>
                  </div>
                )}
              </div>
              <StatusSpan status={item.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
