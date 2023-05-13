import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useState } from "react";

export interface TokenIconSpanProps {
  code: string;
  name: string;
}

export const TokenIconSpan: React.FC<TokenIconSpanProps> = ({ code, name }) => {
  const [hasError, setHasError] = useState(false);

  function handleImageInputError() {
    setHasError(true);
  }

  const inputIcon = `${coinMirrorUrl}/img/${code.toLowerCase()}-${name.toLowerCase()}.png`;

  return (
    <img
      className="w-7 h-7 mb-auto rounded-full"
      src={hasError ? "/imgs/empty-img.png" : inputIcon}
      alt={name}
      onError={handleImageInputError}
    />
  );
};
