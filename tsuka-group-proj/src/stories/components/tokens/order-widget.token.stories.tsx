import {
  OrderWidgetToken,
  OrderWidgetTokenProps,
} from "@/components/tokens/order-widget.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/OrderWidgetToken",
  component: OrderWidgetToken,
  args: {
    inputToken: {
      id: "1",
      name: "Ethereum",
      code: "ETH",
      boundData: {
        buy: true,
        values: {
          value: 5347.94,
          min: 3214,
          max: 9873.43,
        },
      },
    },
    outputToken: {
      id: "2",
      code: "BTC",
      name: "Bitcoin",
      boundData: {
        buy: true,
        values: {
          value: 8234.94,
          min: 1243,
          max: 9873.43,
        },
      },
    },
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<OrderWidgetTokenProps>;

export const FiltersButton: StoryObj<OrderWidgetTokenProps> = {};
