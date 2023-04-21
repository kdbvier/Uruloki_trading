import {
  BlurProps,
  BlurLanding as BlurLandingComponent,
} from "@/components/landing/blur.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/BlurLanding",
  component: BlurLandingComponent,
  args: {
    left: 94,
    top: -86,
    radius: 300,
    color: "#004B35",
    blurSize: 200
  },
} as Meta<BlurProps>;

export const BlurLanding: StoryObj<BlurProps> = {};
