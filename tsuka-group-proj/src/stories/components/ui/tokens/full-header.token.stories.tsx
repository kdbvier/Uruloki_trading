import {
  FullHeaderToken,
  FullHeaderTokenProps,
} from "@/components/ui/tokens/full-header.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/FullHeaderToken",
  component: FullHeaderToken,
  args: {
    token: {
      id: "1",
      token: "ETH",
    },
  },
} as Meta<FullHeaderTokenProps>;

export const FiltersButton: StoryObj<FullHeaderTokenProps> = {};
