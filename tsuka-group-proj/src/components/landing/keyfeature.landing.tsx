import Image from "next/image";

export interface KeyFeatureCardProps {
  title: string;
  description: string;
  icon: {
    url: string;
    width: number;
    height: number;
  };
}

export const KeyFeatureCard: React.FC<KeyFeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="w-full h-80 bg-red-900 bg-opacity-3 border backdrop-blur-15 rounded-30 pl-[38px] pr-[24px] pt-[51px] pb-[42px]">
      <div className="w-[44px] h-[40px] bg-slate-600 flex justify-center items-center rounded-3xl">
        <Image src={icon.url} alt="keyfeature__image" width={24} height={24}/>
      </div>
      <h1 className="text-white text-xl font-semibold">{title}</h1>
      <h1 className="text-white text-xl font-semibold font-gilroy">{title}</h1>
      <h1 className="text-white text-xl font-semibold font-mono">{title}</h1>
      <h4 className="text-white">{description}</h4>
    </div>
  );
};
