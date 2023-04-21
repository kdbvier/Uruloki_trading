import Image from "next/image";
import { CoinTypeLanding } from "./cointype.landing";
import { SectionTitle, SectionTitleProps } from "./sectiontitle.landing";
import { BlurLanding } from "./blur.landing";

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
    <div className="w-[1440px] bg-black py-4 overflow-hidden relative">
      <BlurLanding
        width={889}
        height={629}
        left={-401}
        top={-251}
        blurSize={200}
        circles={[
          {
            radius: 629,
            left: 0,
            top: 0,
            color: "#2DB28A",
          },
          {
            radius: 300,
            left: 495,
            top: 166,
            color: "#00261B",
          },
        ]}
      />
      <SectionTitle
        MainText={title}
        beforeMainText={beforeHeroText}
        afterMainText={afterHeroText}
      />
      <div className="text-tsuka-100 mb-4 md:mb-0 z-10">
        <div className="flex justify-center mt-10">
          <div className="bg-[#ffffff44] rounded-full p-[1px] mr-4 flex justify-center items-center">
            <input
              type={"email"}
              className="h-full w-[312px] text-white bg-black text-base font-normal rounded-full pl-[23px] py-[17.5px] pr-[14px]"
              placeholder="Enter Your Email"
            ></input>
          </div>
          <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px] justify-center items-center">
            <button className="h-full text-white bg-black text-base font-normal text-center rounded-full pl-[38.5px] py-[17.5px] pr-[38.5px]">
              Get Started
            </button>
          </div>
        </div>
        <div className="relative w-full flex justify-center">
          <BlurLanding
            width={519}
            height={519}
            left={752}
            top={0}
            blurSize={150}
            circles={[
              {
                radius: 519,
                left: 0,
                top: 0,
                color: "#013E2B",
              },
            ]}
          />
          <div className="absolute top-0 left-[-6px] w-full">
            <div
              className="absolute left-[-249px] top-[287px] w-[570px] h-[65.46px]"
              style={{
                background:
                  "linear-gradient(270deg, #31C699 -3.19%, #003525 95.62%)",
                transform:"skewY(-7deg)"
              }}
            ></div>
            <div
              className="absolute left-[-80px] top-[208.11px] w-[466.67px] h-[65.46px]"
              style={{
                boxSizing: 'border-box',
                borderTop: '1px solid',
                borderTopColor: "linear-gradient(270deg, #31C699 -3.19%, #003525 95.62%)",
                transform:"skewY(-7deg)"
              }}
            ></div>
            <div
              className="absolute left-[1017.78px] top-[50px] w-[466.67px] h-[65.46px]"
              style={{
                background:
                'linear-gradient(88.02deg, #31C699 0.85%, #003525 95.39%)',
                transform:"skewY(-7deg)"
              }}
            ></div>
            <div
              className="absolute left-[840px] top-[116.44px] w-[680px] h-[65.46px]"
              style={{
                boxSizing: 'border-box',
                borderBottom: '1px solid',
                borderBottomColor: 'linear-gradient(88.02deg, #31C699 0.85%, #003525 95.39%)',
                transform:"skewY(-7deg)"
              }}
            ></div>
          </div>
          <Image
            src={image.url}
            alt="hero_image"
            width={1024}
            height={1}
            style={{ position: "relative" }}
          />
        </div>
      </div>
    </div>
  );
};
