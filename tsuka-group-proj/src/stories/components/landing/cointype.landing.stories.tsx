import {
  CoinTypeProps,
  CoinTypeLanding as CoinTypeLandingComponent,
} from "@/components/landing/cointype.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/CoinTypeLanding",
  component: CoinTypeLandingComponent,
  args: {
    coins:[
      {
        url: '/icons/medal1.png',
        name:'Ethereum',
        abbr: 'ETH',
        rate: 5.53,
        price: 12574.24
      },
      {
        url: '/icons/medal2.png',
        name:'Bitcoin',
        abbr: 'BTC',
        rate: 6.95,
        price: 12503.63
      },
      {
        url: '/icons/medal3.png',
        name:'Anchor',
        abbr: 'ANC',
        rate: 3.21,
        price: 15590.74
      },
      {
        url: '/icons/medal1.png',
        name:'Ethereum',
        abbr: 'ETH',
        rate: 5.53,
        price: 12574.24
      },
    ]
  },
} as Meta<CoinTypeProps>;

export const CoinTypeLanding: StoryObj<CoinTypeProps> = {};
