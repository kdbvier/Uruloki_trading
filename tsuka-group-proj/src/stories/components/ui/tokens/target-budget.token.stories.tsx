import { TargetBudgetToken } from "@/components/ui/tokens/target-budget.token";
import { ChartBound } from "@/types/chart-bound.type";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/TargetBudgetToken",
  component: TargetBudgetToken,
  args: {
    buy: true,
    values: {
      value: 6345,
      min: 231,
      max: 7345,
    },
  },
} as Meta<ChartBound>;

export const FiltersButton: StoryObj<ChartBound> = {};
