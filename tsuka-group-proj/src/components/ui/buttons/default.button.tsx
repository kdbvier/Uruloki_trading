import { IconType } from "react-icons";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { useEffect, useState } from "react";
import { local } from "web3modal";

export interface DefaultButtonProps {
  label: string;
  callback: () => void;
  filled?: boolean;
  Icon?: IconType;
  RightIcon?: IconType;
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  label,
  callback,
  filled,
  Icon,
  RightIcon,
}) => {
  const [isConnected, setIsConnected] = useState<any>();
  useEffect(() => {
    setIsConnected(localStorage.getItem("wagmi.connected"));
    setInterval(() => {
      setIsConnected(
        localStorage.getItem("wagmi.connected")
          ? localStorage.getItem("wagmi.connected")
          : ""
      );
    }, 10);
    // 
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        if (isConnected) {
          callback();
        }
      }}
      className={`
      ${isConnected ? "hover:bg-custom-primary/90 cursor-pointer" : "bg-slate-600 cursor-default"}
      ${
        filled
          ? "text-white bg-custom-primary"
          : "text-custom-primary hover:text-custom-primary/90"
      }
       w-full text-center focus:outline-none rounded-md text-sm px-5 py-2 inline-flex justify-center items-center mr-2 transition-all`}
    >
      {Icon && (
        <label className="mr-1">
          <Icon />
        </label>
      )}
      {label}
      {RightIcon && (
        <label className="ml-1">
          <RightIcon />
        </label>
      )}
    </button>
  );
};
