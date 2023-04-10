import { tokensData } from "@/@fake-data/token.fake-data";
import { getTokenBoundData } from "@/store/apps/new-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";
import { TargetBudgetToken } from "../ui/tokens/target-budget.token";

export interface OrderWidgetTokenProps {
  token: {
    id: string;
    token: string;
  };
}

export const OrderWidgetToken: React.FC<OrderWidgetTokenProps> = ({
  token,
}) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.tokenBound);

  useEffect(() => {
    dispatch(getTokenBoundData(token.id));
  }, [dispatch, token]);

  const currentToken = tokensData.find((item) => item.id === token.id)!;
  const compareToken = tokensData.find((item) => item.id !== token.id)!;

  return (
    <div>
      <DefaultButton
        label="Create an Order"
        callback={() => console.log("default click")}
        filled={true}
        Icon={FiPlusCircle}
      />

      {status === "loading" && "Loading..."}
      {status === "ok" && value && currentToken && (
        <div className="overflow-auto">
          {value.pairs?.map((item) => (
            <>
              <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-6">
                <div className="flex flex-row items-center mb-4">
                  <HorizontalIconsToken
                    inputToken={{ code: value.code, name: value.token }}
                    outputToken={{ code: item.code, name: item.name }}
                  />
                  <div className="px-2 flex-1 flex-col">
                    <p className="text-sm">
                      <label className="text-tsuka-50 text-base font-semibold">
                        {value.code}
                      </label>
                      /{item.code}
                    </p>
                    <label className="text-xs">ID: {value.id}</label>
                  </div>
                  <div className="text-sm text-end">
                    <div className="text-tsuka-200 text-xs">Status</div>
                    <div
                      className={`${true ? "text-green-400" : "text-red-400"}`}
                    >
                      <li>Active</li>
                    </div>
                  </div>
                </div>
                <TargetBudgetToken
                  buy={value.bound.buy}
                  values={value.bound.values}
                />
                <TargetBudgetToken buy={item.buy} values={item.values} />
              </div>

              <DefaultButton
                label="Manage"
                callback={() => console.log("default click")}
              />
            </>
          ))}
        </div>
      )}
    </div>
  );
};
