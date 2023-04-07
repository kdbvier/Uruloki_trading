import {
  TargetBudgetToken,
  TargetBudgetTokenProps,
} from "@/components/ui/tokens/target-budget.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/TargetBudgetToken",
  component: TargetBudgetToken,
  args: {
    title: "SELL",
    percentValue: 33,
  },
} as Meta<TargetBudgetTokenProps>;

export const FiltersButton: StoryObj<TargetBudgetTokenProps> = {};
