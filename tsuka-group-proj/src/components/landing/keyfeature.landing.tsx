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
    <div className="w-full h-80 bg-white bg-opacity-[0.03] border border-white border-opacity-[0.12] backdrop-blur-[15px] rounded-3xl pl-[38px] pr-[24px] pt-[51px] pb-[42px]">
      <div className="w-[56px] h-[57px] bg-white bg-opacity-5 backdrop-blur-[10px] flex justify-center items-center rounded-xl">
        <Image src={icon.url} alt="keyfeature__image" width={20} height={18}/>
      </div>
      <h1 className="text-white text-xl leading-8 font-semibold mt-7 pr-12">{title}</h1>
      <h4 className="text-[#ADADAD] mt-2 pr-12 text-[15px] leading-7">{description}</h4>
    </div>
  );
};
