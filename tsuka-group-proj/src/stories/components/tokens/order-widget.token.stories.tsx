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
    token: {
      id: "1",
      token: "ETH",
      icon: "/tokens/btc-icon.svg",
    },
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<OrderWidgetTokenProps>;

export const FiltersButton: StoryObj<OrderWidgetTokenProps> = {};
