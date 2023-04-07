import {
  LiveGraphToken,
  LiveGraphTokenProps,
} from "@/components/tokens/live-graph.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/LiveGraphToken",
  component: LiveGraphToken,
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
} as Meta<LiveGraphTokenProps>;

export const FiltersButton: StoryObj<LiveGraphTokenProps> = {};
