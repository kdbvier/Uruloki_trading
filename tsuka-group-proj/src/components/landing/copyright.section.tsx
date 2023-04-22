import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export interface CopyRightProps {}

export const CopyRight: React.FC<CopyRightProps> = () => {
  return (
    <div className="w-[1440px]">
      <div className="flex w-full justify-between items-end pt-10 pb-5 border-t border-t-[#ADADAD66] bg-black">
        <h3 className="font-Inter-300 font-normal text-[#ADADAD] text-base">
          &copy; 2023 Uruloki Trading. All Rights Reserved
        </h3>
        <div className="flex gap-6 items-center text-[#ADADAD]">
          <FaTwitter width={24} />
          <FaLinkedin width={24} />
          <FaFacebook width={24} />
        </div>
      </div>
    </div>
  );
};
