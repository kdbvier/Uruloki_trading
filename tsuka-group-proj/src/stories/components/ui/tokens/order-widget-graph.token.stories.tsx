import { OrderWidgetGraph } from "@/components/ui/tokens/order-widget-graph.token";
import { ChartBound } from "@/types/chart-bound.type";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/OrderWidgetGraph",
  component: OrderWidgetGraph,
  args: {
    buy: true,
    budgets: [2531],
    min: 153,
    max: 7345,
  },
} as Meta<ChartBound>;

export const FiltersButton: StoryObj<ChartBound> = {};
