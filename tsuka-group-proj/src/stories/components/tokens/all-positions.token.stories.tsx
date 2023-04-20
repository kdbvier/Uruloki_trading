import {
  AllPositionsToken,
  AllPositionsTokenProps,
} from "@/components/tokens/all-positions.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/AllPositionsToken",
  component: AllPositionsToken,
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
} as Meta<AllPositionsTokenProps>;

export const FiltersButton: StoryObj<AllPositionsTokenProps> = {};
