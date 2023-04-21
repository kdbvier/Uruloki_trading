import { BenifitCard, BenifitCardProps } from "./benifit.landing";

import { SectionTitle } from "./sectiontitle.landing";
import { BlurLanding } from "./blur.landing";

export interface BenifitsSectionProps {
  beforeMainText: string;
  afterMainText: string;
  MainText: string;
  items: BenifitCardProps[];
}

export const BenifitsSection: React.FC<BenifitsSectionProps> = ({
  beforeMainText,
  afterMainText,
  MainText,
  items,
}) => {

  return (
    <div className="w-[1440px] bg-black py-4 overflow-hidden relative">
      <BlurLanding
        width={799}
        height={574}
        left={225}
        top={5}
        blurSize={150}
        circles={[
          {
            radius: 519,
            left: 0,
            top: 0,
            color: "#013223",
          },
          {
            radius: 354,
            left: 430,
            top: 210,
            color: "#013E2B",
          },
        ]}
      />
      <SectionTitle
        MainText={MainText}
        beforeMainText={beforeMainText}
        afterMainText={afterMainText}
        beforeTextStyle={false}
      />
      <div className="flex flex-wrap gap-8 px-28 mt-24">
        {items.map((item, index) => {
          return (
            <BenifitCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
};
