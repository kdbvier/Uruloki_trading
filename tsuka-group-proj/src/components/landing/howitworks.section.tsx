
import {
  GettingStartedItemProps,
  GettingStartedItem,
} from "./getttingstarted.landing";
import { SectionTitle } from "./sectiontitle.landing";

export interface HowItWorksSectionProps {
  beforeMainText: string;
  afterMainText: string;
  MainText: string;
  items: GettingStartedItemProps[];
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  beforeMainText,
  afterMainText,
  MainText,
  items,
}) => {
  return (
    <div className="w-[1440px] bg-black py-4 overflow-hidden">
      <SectionTitle
        MainText={MainText}
        beforeMainText={beforeMainText}
        afterMainText={afterMainText}
        beforeTextStyle={false}
      />
      <div className="flex flex-col mt-24">
        {items.map((item) => {
          return (
            <GettingStartedItem
              key={item.descriptionHeader}
              descriptionHeader={item.descriptionHeader}
              description={item.description}
              image={item.image}
              features={item.features}
              orientation={item.orientation}
            />
          );
        })}
      </div>
    </div>
  );
};
