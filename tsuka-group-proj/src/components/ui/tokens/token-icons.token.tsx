import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useState } from "react";
import Image from "next/image";

export interface TokenIconsTokenProps {
  name: string;
  shortName: string;
  width?: number;
  height?: number;
  className?: string;
}

export const TokenIconsToken: React.FC<TokenIconsTokenProps> = ({
  name,
  shortName,
  width = 24,
  height = 24,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  function handleImageInputError() {
    setHasError(true);
  }

  const img = `${coinMirrorUrl}/img/${shortName.toLowerCase()}-${name.replace(" ", "-").toLowerCase()}.png`;

  return (
    <div className={className + " rounded-full overflow-hidden bg-tsuka-50"}>
      <img src={hasError ? "/imgs/empty-img7.png" : img} width={width} height={height} alt="token" onError={handleImageInputError}/>
    </div>
  );
};
