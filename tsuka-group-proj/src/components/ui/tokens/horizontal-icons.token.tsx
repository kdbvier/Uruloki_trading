export interface HorizontalIconsTokenProps {
  inputIconPath: string;
  outputIconPath: string;
  large?: boolean;
}

export const HorizontalIconsToken: React.FC<HorizontalIconsTokenProps> = ({
  inputIconPath,
  outputIconPath,
  large = false,
}) => {
  return (
    <div
      className={`${large ? "w-12 h-12" : "w-10 h-10"} mx-4 flex -space-x-4`}
    >
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mb-auto rounded-full`}
        src={inputIconPath}
        alt={inputIconPath}
      />
      <img
        className={`${large ? "w-10 h-10" : "w-8 h-8"} mt-auto rounded-full`}
        src={outputIconPath}
        alt={outputIconPath}
      />
    </div>
  );
};
