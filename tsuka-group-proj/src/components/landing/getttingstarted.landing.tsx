import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { BlurLanding } from "./blur.landing";

export interface GettingStartedItemProps {
  descriptionHeader: string;
  description: string;
  features: string[];
  orientation: boolean;
  image: {
    url: string;
    width: number;
    height: number;
  };
}

const CustomCheck = () => {
  return (
    <div className="w-7 h-7 rounded-full bg-[#272727] flex justify-center items-center">
      <FaCheck className="text-[#31C699] text-xs"/>
    </div>
  );
}

export const GettingStartedItem: React.FC<GettingStartedItemProps> = ({
  descriptionHeader,
  description,
  features,
  orientation,
  image,
}) => {
  return (
    // <div className={"w-[1440px] bg-slate-900 flex items-center gap-[111px]"}>
    <div
      className={`${
        !orientation
          ? "pl-28 pr-16"
          : "pl-12 pr-20 flex-row-reverse"
      } w-[1440px] bg-black flex items-center gap-[111px]`}
    >
      <div className="w-[560px] pr-5">
        <h1 className="text-white text-[40px] leading-[52px]">{descriptionHeader}</h1>
        <h1 className="text-[#ADADAD] text-base leading-8 mt-4">{description}</h1>
        <ul className="pl-4 flex flex-col gap-4 mt-8">
          {features.map((feature) => {
            return <li key={feature} className="text-[#ADADAD] text-base leading-[175%] pr-20 flex items-center gap-3"><CustomCheck />{feature}</li>;
          })}
        </ul>
      </div>
      <div className="relative flex-1">
        <BlurLanding width={513} height={513} left={0} top={-58} blurSize={150} circles={[
          {
            radius: 513,
            left: 0,
            top: 0,
            color: "#00261B",
          },
          {
            radius: 513,
            left: 0,
            top: 0,
            color: "#00261B",
          }
        ]}/>
        <Image src={image.url} alt={"feature__image"} width={625} height={618} style={{backgroundColor: 'transparent', zIndex: 2, position:'relative'}}/>
      </div>
    </div>
  );
};
