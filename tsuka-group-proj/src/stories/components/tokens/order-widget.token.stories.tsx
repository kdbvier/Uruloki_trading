import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { store } from "@/store";
import {
  OrderTypeEnum,
  PriceTypeEnum,
  TokenOrder,
} from "@/types/token-order.type";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/OrderWidgetToken",
  component: OrderWidgetToken,
  args: {
    name1: "Ethereum",
    code1: "ETH",
    code2: "BTC",
    name2: "Bitcoin",
    orders: [
      {
        id: 1,
        price_type: PriceTypeEnum.SINGLE,
        order_type: OrderTypeEnum.BUY,
        price: 2346.54,
      },
      {
        id: 2,
        price_type: PriceTypeEnum.RANGE,
        order_type: OrderTypeEnum.SELL,
        prices: [5424.54, 1324.57],
      },
    ],
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<TokenOrder>;

export const FiltersButton: StoryObj<TokenOrder> = {};