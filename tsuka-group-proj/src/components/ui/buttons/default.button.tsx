import { IconType } from "react-icons";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { useEffect, useState } from "react";

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
  const [isConnected, setIsConnected] = useState("");
  useEffect(() => {
    const connect = async () => {
      setIsConnected(await getConnectedAddress());
    };
    connect()
  }, []);
  return (
    <button
      type="button"
      onClick={() => isConnected && callback }
      className={`
      ${
        isConnected ?
        "hover:bg-custom-primary/90":
        "bg-slate-600"
      }
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
