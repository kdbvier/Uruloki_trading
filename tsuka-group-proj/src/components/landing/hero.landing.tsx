import Image from "next/image";

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
      <div className="px-28 justify-center text-center relative">
        <div className="absolute inset-0 flex justify-center items-center w-[519px] h-[519px] rounded-full bg-[#2D828A] filter blur-[200px] left-[-401px] top-[-251px] z-[-1]">
        </div>
        <div className="absolute inset-0 flex justify-center items-center w-[393px] h-[393px] rounded-full bg-[#004B35] filter blur-[200px] left-[94px] top-[-84px] z-[-1]">
        </div>
        <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px]">
          <h1 className=" text-white bg-tsuka-500 text-xs font-normal text-center rounded-full pl-[12px] py-[6px] pr-[18px]">
            {beforeHeroText}
          </h1>
        </div>
        <div className="px-14 mt-5 bg-transparent z-40">
          <span className="block m-auto text-6xl font-semibold text-center text-white z-50">
            {title}
          </span>
        </div>
        <div className=" text-tsuka-100 text-base px-72 mt-5 mb-8 md:mb-0">
          {afterHeroText}
        </div>
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
        <div className="text-tsuka-100 mb-4 md:mb-0">
          <Image
            src={image.url}
            alt="hero_image"
            width={image.width}
            height={image.height}
          />
        </div>
      </div>
    </div>
  );
};
