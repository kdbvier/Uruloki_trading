import {
  HorizontalIconsToken,
  HorizontalIconsTokenProps,
} from "@/components/ui/tokens/horizontal-icons.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/HorizontalIconsToken",
  component: HorizontalIconsToken,
  args: {
    inputIconPath: "/tokens/btc-icon.svg",
    outputIconPath: "/tokens/eth-icon.svg",
  },
} as Meta<HorizontalIconsTokenProps>;

export const FiltersButton: StoryObj<HorizontalIconsTokenProps> = {};
