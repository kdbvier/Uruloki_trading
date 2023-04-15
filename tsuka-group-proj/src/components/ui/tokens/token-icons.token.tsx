import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useState } from "react";
import Image from "next/image";

export interface TokenIconsTokenProps {
  name: string;
  shortName: string;
}

export const TokenIconsToken: React.FC<TokenIconsTokenProps> = ({
  name,
  shortName,
}) => {
  const [hasError, setHasError] = useState(false);

  function handleImageInputError() {
    setHasError(true);
  }

  const img = `${coinMirrorUrl}/img/${shortName.toLowerCase()}-${name.toLowerCase()}.png`;

  return (
    <Image src={hasError ? "/imgs/empty-img.png" : img} width={24} height={24} alt="token" />
  );
};
