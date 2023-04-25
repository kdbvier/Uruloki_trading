import {
  OrderBookToken,
  OrderBookTokenProps,
} from "@/components/tokens/order-book.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/OrderBookToken",
  component: OrderBookToken,
  args: {
    token: {
      id: "1",
      token: "ETH",
    },
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<OrderBookTokenProps>;

export const FiltersButton: StoryObj<OrderBookTokenProps> = {};
