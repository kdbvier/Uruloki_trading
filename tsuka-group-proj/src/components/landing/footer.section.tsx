import { FaArrowRight } from "react-icons/fa";

export interface FooterProps {
  mainText: string;
  afterMainText: string;
}

export const FooterLanding: React.FC<FooterProps> = ({
  mainText,
  afterMainText,
}) => {
  return (
    <div className="w-[1440px] h-[424px] py-4 overflow-hidden relative bg-black bg-cover bg-center bg-no-repeat bg-[url('/footer-background.png')]">
      <div className="px-28 justify-center text-center relative mt-[103px]">
        <div className="px-14 mt-5 bg-transparent z-40">
          <span className="block m-auto text-3xl font-semibold text-center text-white z-50">
            {mainText}
          </span>
        </div>
        <div className=" text-tsuka-100 text-base leading-[200%] px-[358px] mt-4 mb-10 md:mb-0">
          {afterMainText}
        </div>
      </div>
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
            <button className="h-full text-white bg-tsuka-500 text-base font-normal text-center rounded-full pl-[12px] py-[6px] pr-[12px] flex justify-center items-center gap-3">
              {"Get Started"}<FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
