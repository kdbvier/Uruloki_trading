import Image from "next/image";
import { BlurLanding } from "./blur.landing";

export interface SectionTitleProps {
  mainText: string;
  beforeMainText: string;
  afterMainText: string;
  beforeTextStyle: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  mainText,
  beforeMainText,
  afterMainText,
  beforeTextStyle = false,
}) => {
  let BeforeStyle = beforeTextStyle
    ? "bg-gradient-to-r from-[#003525] to-[#31C699]"
    : "bg-[#ffffff44]";
  return (
    <div className="px-28 justify-center text-center relative">
      <div className={`inline-block ${BeforeStyle} rounded-full p-[1px]`}>
        <h1 className=" text-white bg-black text-xs leading-[150%] font-normal text-center rounded-full pl-[12px] py-[6px] pr-[18px]">
          {beforeMainText}
        </h1>
      </div>
      <div className="px-14 mt-5 bg-transparent z-40">
        <span className="block m-auto text-6xl leading-[120%] font-semibold text-center text-white z-50">
          {mainText}
        </span>
      </div>
      <div className=" text-tsuka-100 text-base leading-[200%] px-72 mt-5 mb-8 md:mb-0">
        {afterMainText}
      </div>
    </div>
  );
};
