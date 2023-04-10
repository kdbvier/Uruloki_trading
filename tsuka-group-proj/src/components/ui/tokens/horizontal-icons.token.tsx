import { coinMirrorUrl } from "@/services/coin-mirror.service";

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
  const inputIcon = `${coinMirrorUrl}/img/${inputToken?.code.toLowerCase()}-${inputToken?.name.toLowerCase()}.png`;
  const outputIcon = `${coinMirrorUrl}/img/${outputToken?.code.toLowerCase()}-${outputToken?.name.toLowerCase()}.png`;

  return (
    <div
      className={`${large ? "w-12 h-12" : "w-10 h-10"} mx-4 flex -space-x-4`}
    >
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mb-auto rounded-full`}
        src={inputIcon}
        alt={inputToken?.name}
      />
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mt-auto rounded-full`}
        src={outputIcon}
        alt={outputToken?.name}
      />
    </div>
  );
};
