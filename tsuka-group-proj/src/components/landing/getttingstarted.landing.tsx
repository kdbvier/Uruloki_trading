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
  index: number;
}

const CustomCheck = () => {
  return (
    <div className="w-7 h-7 rounded-full bg-[#272727] flex justify-center items-center">
      <FaCheck className="text-[#31C699] text-xs" />
    </div>
  );
};
const gapList = [
  "gap-[0px]",
  "gap-[51px]",
  "gap-[1px]",
  "gap-[111px]",
]
export const GettingStartedItem: React.FC<GettingStartedItemProps> = ({
  descriptionHeader,
  description,
  features,
  orientation,
  image,
  index,
}) => {
  return (
    // <div className={"w-[1440px] bg-slate-900 flex items-center gap-[111px]"}>
    <div
      className={`${
        orientation ? "" : "flex-row-reverse"
      } bg-black lg:flex items-center ${gapList[index]}`}
    >
      
      {index == 0 && (
        <div className="relative">
          <BlurLanding
            width={513}
            height={513}
            left={0}
            top={0}
            blurSize={150}
            circles={[
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
              },
            ]}
          />
          <Image
            src={image.url}
            alt={"feature__image"}
            width={625}
            height={618}
            style={{
              backgroundColor: "transparent",
              zIndex: 2,
              position: "relative",
            }}
          />
        </div>
      )}
      {index == 1 && (
        <div className="relative">
          <BlurLanding
            width={513}
            height={513}
            left={100}
            top={-20}
            blurSize={150}
            circles={[
              {
                radius: 513,
                left: 0,
                top: 0,
                color: "#013324",
              },
              {
                radius: 513,
                left: 0,
                top: 0,
                color: "#013324",
              },
            ]}
          />
          <Image
            src={image.url}
            alt={"feature__image"}
            width={701}
            height={618}
            style={{
              backgroundColor: "transparent",
              zIndex: 2,
              position: "relative",
            }}
          />
        </div>
      )}
      {index == 2 && (
        <div className="relative">
          <BlurLanding
            width={513}
            height={513}
            left={50}
            top={0}
            blurSize={150}
            circles={[
              {
                radius: 513,
                left: 0,
                top: 0,
                color: "#013324",
              },
              {
                radius: 513,
                left: 0,
                top: 0,
                color: "#013324",
              },
            ]}
          />
          <Image
            src={image.url}
            alt={"feature__image"}
            width={701}
            height={618}
            style={{
              backgroundColor: "transparent",
              zIndex: 2,
              position: "relative",
            }}
          />
        </div>
      )}
      {index == 3 && (
        <div className="relative flex-1">
          <BlurLanding
            width={513}
            height={513}
            left={93}
            top={-20}
            blurSize={150}
            circles={[
              {
                radius: 513,
                left: 0,
                top: 0,
                color: "#013324",
              },
              {
                radius: 513,
                left: 0,
                top: 0,
                color: "#013324",
              },
            ]}
          />
          <Image
            src={image.url}
            alt={"feature__image"}
            width={625}
            height={618}
            style={{
              backgroundColor: "transparent",
              zIndex: 2,
              position: "relative",
            }}
          />
        </div>
      )}
      <div className="pr-5 flex-1">
        <h1 className="text-white text-[40px] font-Gilroy-600 leading-[52px]">
          {descriptionHeader}
        </h1>
        <h1 className="text-[#ADADAD] font-Inter-400 text-base leading-8 mt-4">
          {description}
        </h1>
        <ul className="pl-4 flex flex-col gap-4 mt-8">
          {features.map((feature) => {
            return (
              <li
                key={feature}
                className="text-[#ADADAD] text-base font-Inter-400 leading-[175%] sm:pr-20 flex items-center gap-3"
              >
                <CustomCheck />
                <span className="flex-1">{feature}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
