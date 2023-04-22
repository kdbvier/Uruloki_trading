import { KeyFeatureCard } from "./keyfeature.landing";
import Image from "next/image";
import { KeyFeatureCardProps } from "./keyfeature.landing";
import { SectionTitle } from "./sectiontitle.landing";
import { BlurLanding } from "./blur.landing";
import { useState } from "react";

export interface KeyFeaturesSectionProps {
  beforeMainText: string;
  afterMainText: string;
  mainText: string;
  featuresCollection: {
    items: KeyFeatureCardProps[];
  };
}

export const KeyFeaturesSection: React.FC<KeyFeaturesSectionProps> = ({
  beforeMainText,
  afterMainText,
  mainText,
  featuresCollection,
}) => {
  const { items } = featuresCollection;
  const [selectedIndex, setSelectedIndex] = useState(4);
  return (
    <div className="w-[1440px] bg-black py-4 overflow-hidden relative mt-40">
      <BlurLanding
        width={867}
        height={560}
        left={180}
        top={45}
        blurSize={150}
        circles={[
          {
            radius: 519,
            left: 0,
            top: 0,
            color: "#00261B",
          },
          {
            radius: 354,
            left: 513,
            top: 205,
            color: "#00261B",
          },
        ]}
      />
      <SectionTitle
        mainText={mainText}
        beforeMainText={beforeMainText}
        afterMainText={afterMainText}
        beforeTextStyle={false}
      />
      <div className="flex gap-8 px-28 mt-24">
        {items.map((item, index) => {
          return (
            <KeyFeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              selected={selectedIndex == index}
              clickHandler={() => {
                setSelectedIndex(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
