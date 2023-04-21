import { KeyFeatureCard } from "./keyfeature.landing";
import Image from "next/image";
import { KeyFeatureCardProps } from "./keyfeature.landing";
import { SectionTitle } from "./sectiontitle.landing";

export interface KeyFeaturesSectionProps {
  beforeMainText: string;
  afterMainText: string;
  MainText: string;
  items: KeyFeatureCardProps[];
}

export const KeyFeaturesSection: React.FC<KeyFeaturesSectionProps> = ({
  beforeMainText,
  afterMainText,
  MainText,
  items
}) => {
  return (
    <div className="w-[1440px] bg-tsuka-700 py-4 overflow-hidden">
      <SectionTitle
        MainText={MainText}
        beforeMainText={beforeMainText}
        afterMainText={afterMainText}
      />
      <div className="flex gap-8 px-28 mt-24">
        {items.map((item)=> {
          return (
            <KeyFeatureCard key={item.title} title={item.title} description={item.description} icon={item.icon}/>
          );
        })}
      </div>
    </div>
  );
};
