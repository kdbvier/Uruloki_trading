import Image from "next/image";
import { CoinTypeLanding } from "./cointype.landing";
import { SectionTitle, SectionTitleProps } from "./sectiontitle.landing";

export interface HeroProps {
  title: string;
  beforeHeroText: string;
  afterHeroText: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}

export const HeroLanding: React.FC<HeroProps> = ({
  title,
  beforeHeroText,
  afterHeroText,
  image,
}) => {
  return (
    <div className="w-[1440px] bg-tsuka-700 py-4 overflow-hidden">
      <SectionTitle
        MainText={title}
        beforeMainText={beforeHeroText}
        afterMainText={afterHeroText}
      />
      <div className="text-tsuka-100 mb-4 md:mb-0">
        <div className="flex justify-center mt-10">
          <div className="inline-block bg-[#ffffff44] rounded-full p-[1px] mr-4">
            <input
              type={"email"}
              className="h-full text-white bg-tsuka-500 text-base font-normal rounded-full pl-[12px] py-[6px] pr-[18px]"
              placeholder="Enter Your Email"
            ></input>
          </div>
          <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px] justify-center items-center">
            <button className="h-full text-white bg-tsuka-500 text-base font-normal text-center rounded-full pl-[12px] py-[6px] pr-[12px]">
              Get Started
            </button>
          </div>
        </div>
        <Image
          src={image.url}
          alt="hero_image"
          width={image.width}
          height={image.height}
        />
      </div>
    </div>
  );
};
