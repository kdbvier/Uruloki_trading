import {
  HeroProps,
  HeroLanding as HeroLandingComponent,
} from "@/components/landing/hero.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section",
  component: HeroLandingComponent,
  args: {
    title: "All-in-one platform for decentralized asset trading and arbitrage",
    beforeHeroText: "Automate Your Crypto Trades with Uruloki",
    afterHeroText:
      "Our platform allows you to create an order book for decentralized assets, and group multiple orders into a single strategy for arbitraging between assets.",
    image: {
      url: "https://images.ctfassets.net/imgksyjxr9j5/4Rg2kkoMiGufVe6zDzlSLA/c74d8f75172217d8445962ed24c2ef70/3_2_screen_mockup.png",
      width: 2106,
      height: 1536,
    },
  },
} as Meta<HeroProps>;

export const HeroSection: StoryObj<HeroProps> = {};
