import { BenifitCard, BenifitCardProps } from "./benifit.landing";

import { SectionTitle } from "./sectiontitle.landing";
import { BlurLanding } from "./blur.landing";

export interface BenifitsSectionProps {
  beforeMainText: string;
  afterMainText: string;
  mainText: string;
  benefitItemsCollection: {
    items: BenifitCardProps[];
  };
}

export const BenifitsSection: React.FC<BenifitsSectionProps> = ({
  beforeMainText,
  afterMainText,
  mainText,
  benefitItemsCollection,
}) => {
  const { items } = benefitItemsCollection;
  return (
    <div className="w-[1440px] bg-black py-4 overflow-hidden relative pt-40 pb-44">
      <BlurLanding
        width={799}
        height={574}
        left={225}
        top={55}
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
        mainText={mainText}
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
