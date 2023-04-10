import { coinMirrorUrl } from "@/services/coin-mirror.service";
import { useState } from "react";

export interface HorizontalIconsTokenProps {
  inputToken: { code: string; name: string };
  outputToken: { code: string; name: string };
  large?: boolean;
}

export const HorizontalIconsToken: React.FC<HorizontalIconsTokenProps> = ({
  inputToken,
  outputToken,
  large = false,
}) => {
  const [hasInputError, setHasInputError] = useState(false);
  const [hasOutputError, setHasOutputError] = useState(false);

  function handleImageInputError() {
    setHasInputError(true);
  }

  function handleImageOutputError() {
    setHasOutputError(true);
  }

  const inputIcon = `${coinMirrorUrl}/img/${inputToken?.code.toLowerCase()}-${inputToken?.name.toLowerCase()}.png`;
  const outputIcon = `${coinMirrorUrl}/img/${outputToken?.code.toLowerCase()}-${outputToken?.name.toLowerCase()}.png`;

  return (
    <div
      className={`${large ? "w-12 h-12" : "w-10 h-10"} mx-4 flex -space-x-4`}
    >
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mb-auto rounded-full`}
        src={hasInputError ? "/imgs/empty-img.png" : inputIcon}
        alt={inputToken?.name}
        onError={handleImageInputError}
      />
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mt-auto rounded-full`}
        src={hasOutputError ? "/imgs/empty-img.png" : outputIcon}
        alt={outputToken?.name}
        onError={handleImageOutputError}
      />
    </div>
  );
};
