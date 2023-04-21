import {
  BenifitsSectionProps,
  BenifitsSection as BenifitsSectionComponent,
} from "@/components/landing/benifits.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section",
  component: BenifitsSectionComponent,
  args: {
    beforeMainText:"Benefits of Uruloki",
    MainText:"Experience the Future of Trading",
    afterMainText:"Uruloki offers the following benefits:",
    items: [
      {
        title: "Save time & effort with automation",
        description: "Automate your trading activity with pre-set conditions, saving you time and effort."
      },
      {
        title: "Reduce risk with pre-set conditions",
        description: "Trades based on pre-set conditions, reducing the risk of unfavorable trades."
      },
      {
        title: "Maximize profits with arbitrage",
        description: "Profit more with Uruloki's trading strategy by capitalizing on market inefficiencies."
      },
      {
        title: "Customize your trading strategy",
        description: "Uruloki's advanced tools and analytics allow you to create a tailored trading strategy."
      },
      {
        title: "Stay updated with real-time monitoring",
        description: "Access real-time monitoring with Uruloki's real-time management feature."
      },
      {
        title: "Increased Efficiency",
        description: "With Uruloki's automation and trading strategy features, you can execute trades quickly."
      }

    ]

  },
} as Meta<BenifitsSectionProps>;

export const BenifitsSection: StoryObj<BenifitsSectionProps> = {};
