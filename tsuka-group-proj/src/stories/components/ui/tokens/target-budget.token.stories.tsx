import { TargetBudgetToken } from "@/components/ui/tokens/target-budget.token";
import { ChartBound } from "@/types/chart-bound.type";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/TargetBudgetToken",
  component: TargetBudgetToken,
  args: {
    buy: true,
    budgets: [2531],
    values: [7345, 153, 4363, 3533, 234],
  },
} as Meta<ChartBound>;

export const FiltersButton: StoryObj<ChartBound> = {};
