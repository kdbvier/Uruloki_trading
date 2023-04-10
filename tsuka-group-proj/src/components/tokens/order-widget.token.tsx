import { ChartBound } from "@/types/chart-bound.type";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";
import { TargetBudgetToken } from "../ui/tokens/target-budget.token";

export interface OrderWidgetTokenProps {
  inputToken: {
    id: string;
    name: string;
    code: string;
    boundData: ChartBound;
  };
  outputToken: {
    id: string;
    name: string;
    code: string;
    boundData: ChartBound;
  };
}

export const OrderWidgetToken: React.FC<OrderWidgetTokenProps> = ({
  inputToken,
  outputToken,
}) => {
  return (
    <div>
      <DefaultButton
        label="Create an Order"
        callback={() => console.log("default click")}
        filled={true}
        Icon={FiPlusCircle}
      />
      <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-6">
        <div className="flex flex-row items-center mb-4">
          <HorizontalIconsToken
            inputToken={{ code: inputToken.code, name: inputToken.name }}
            outputToken={{ code: outputToken.code, name: outputToken.name }}
          />
          <div className="px-2 flex-1 flex-col">
            <p className="text-sm">
              <label className="text-tsuka-50 text-base font-semibold">
                {inputToken.code}
              </label>
              /{outputToken.code}
            </p>
            <label className="text-xs">ID: {inputToken.id}</label>
          </div>
          <div className="text-sm text-end">
            <div className="text-tsuka-200 text-xs">Status</div>
            <div className={`${true ? "text-green-400" : "text-red-400"}`}>
              <li>Active</li>
            </div>
          </div>
        </div>
        <TargetBudgetToken
          buy={inputToken.boundData.buy}
          values={inputToken.boundData.values}
        />
        <TargetBudgetToken
          buy={outputToken.boundData.buy}
          values={outputToken.boundData.values}
        />
      </div>

      <DefaultButton
        label="Manage"
        callback={() => console.log("default click")}
      />
    </div>
  );
};
