import Image from "next/image";
import { BlurLanding } from "./blur.landing";

export interface SectionTitleProps {
  MainText: string;
  beforeMainText: string;
  afterMainText: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  MainText,
  beforeMainText,
  afterMainText,
}) => {
  return (

      <div className="px-28 justify-center text-center relative">
        <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px]">
          <h1 className=" text-white bg-tsuka-500 text-xs font-normal text-center rounded-full pl-[12px] py-[6px] pr-[18px]">
            {beforeMainText}
          </h1>
        </div>
        <div className="px-14 mt-5 bg-transparent z-40">
          <span className="block m-auto text-6xl font-semibold text-center text-white z-50">
            {MainText}
          </span>
        </div>
        <div className=" text-tsuka-100 text-base px-72 mt-5 mb-8 md:mb-0">
          {afterMainText}
        </div>
        
      </div>

  );
};
