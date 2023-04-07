import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import Coin from "@/pages/coin";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Pages/Coin",
  component: Coin,
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <DashboardLayout>{Story()}</DashboardLayout>
        </Provider>
      );
    },
  ],
} as Meta;

export const CoinPage: StoryObj = {};
