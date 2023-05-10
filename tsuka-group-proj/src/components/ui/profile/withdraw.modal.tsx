import { TokenType } from "@/types/tokens.type";
import { useState } from "react";
import { FaSadCry } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export interface ModalProps {
  open: boolean;
  callback: () => void;
  tokens: TokenType[];
}

export const WithdrawModal: React.FC<ModalProps> = ({
  open,
  callback,
  tokens,
}) => {
  return (
    <>
      {open && (
        <div className="fixed left-0 top-0 z-30 bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px] w-full h-screen">
          <div className="w-full h-full flex justify-center items-center p-4 md:p-0">
            <div className="relative w-full md:w-[440px] bg-tsuka-500 border rounded-2xl border-[#343C4F] text-tsuka-50 p-[24px]">
              <FiX
                className="absolute top-3 right-3 text-tsuka-300 text-lg cursor-pointer"
                onClick={callback}
              />
              <h2 className="text-xl font-Poppins-300 font-medium mb-[22px] text-[24px] leading-[36px] text-['#BBC3D7]">
                Widthdraw
              </h2>
              <div className="relative border border-tsuka-400 rounded-md pr-3 mb-[9px] ">
                <select className="w-full bg-tsuka-500 outline-none pl-[19px] py-[11px] ">
                  <option>Token</option>
                  {tokens?.map((token, index) => (
                    <option value={token.id} key={index}>
                      {token.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Amount"
                className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md  px-[19px] py-[11px] mb-[9px]"
              />
              <button
                onClick={callback}
                className="w-full bg-tsuka-300 hover:bg-tsuka-400 text-white font-Poppins-300 leading-[24px] text-[16px] font-medium py-[11px] rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
