export interface HorizontalIconsTokenProps {
  inputIconPath: string;
  outputIconPath: string;
}

export const HorizontalIconsToken: React.FC<HorizontalIconsTokenProps> = ({
  inputIconPath,
  outputIconPath,
}) => {
  return (
    <div className="flex h-10 -space-x-4">
      <img
        className="w-8 h-8 mb-auto rounded-full"
        src={inputIconPath}
        alt={inputIconPath}
      />
      <img
        className="w-8 h-8 mt-auto rounded-full"
        src={outputIconPath}
        alt={outputIconPath}
      />
    </div>
  );
};
