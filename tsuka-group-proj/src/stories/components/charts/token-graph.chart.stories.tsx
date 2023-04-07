import {
  TokenGraphChart,
  TokenGraphChartProps,
} from "@/components/charts/token-graph.chart";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Charts/TokenGraphChart",
  component: TokenGraphChart,
  args: {
    token: "ETH",
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<TokenGraphChartProps>;

export const FiltersButton: StoryObj<TokenGraphChartProps> = {};
