import { tokensData } from "@/@fake-data/token.fake-data";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";
import { TargetBudgetToken } from "../ui/tokens/target-budget.token";

export interface OrderWidgetTokenProps {
  token: {
    id: string;
    token: string;
    icon: string;
  };
}

export const OrderWidgetToken: React.FC<OrderWidgetTokenProps> = ({
  token,
}) => {
  const [currentToken, compareToken] = tokensData;

  return (
    <div>
      <DefaultButton
        label="Create an Order"
        callback={() => console.log("default click")}
        filled={true}
        Icon={FiPlusCircle}
      />
      <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-6">
        {currentToken && (
          <div>
            <div className="flex flex-row items-center mb-4">
              <HorizontalIconsToken
                inputIconPath={currentToken.chain.icon}
                outputIconPath={compareToken.chain.icon}
              />
              <div className="px-2 flex-1 flex-col">
                <p className="text-sm">
                  <label className="text-tsuka-50 text-base font-semibold">
                    {currentToken.chain.code}
                  </label>
                  /{compareToken.chain.code}
                </p>
                <label className="text-xs">ID: {currentToken.id}</label>
              </div>
              <div className="text-sm text-end">
                <div className="text-tsuka-200 text-xs">Status</div>
                <div className={`${true ? "text-green-400" : "text-red-400"}`}>
                  <li>Active</li>
                </div>
              </div>
            </div>
            <TargetBudgetToken title="BUY" percentValue={70} positive={true} />
            <TargetBudgetToken title="SELL" percentValue={70} />
          </div>
        )}

        <DefaultButton
          label="Manage"
          callback={() => console.log("default click")}
        />
      </div>
    </div>
  );
};
