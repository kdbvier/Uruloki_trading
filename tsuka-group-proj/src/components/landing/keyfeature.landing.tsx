import Image from "next/image";

export interface KeyFeatureCardProps {
  title: string;
  description: string;
  icon: {
    url: string;
    width: number;
    height: number;
  };
  selected: boolean;
  clickHandler: ()=>void;
}

export const KeyFeatureCard: React.FC<KeyFeatureCardProps> = ({
  title,
  description,
  icon,
  selected=false,
  clickHandler=()=>console.log("dfdf")
}) => {
  let selectedIconClass = selected? "bg-gradient-to-br from-teal-500 to-green-900":"bg-white bg-opacity-5";
  return (
    <div className={`w-full h-80 bg-white bg-opacity-[0.03] border border-white border-opacity-[0.12] backdrop-blur-[15px] rounded-3xl pl-[38px] pr-[24px] pt-[51px] pb-[42px]`} onClick={clickHandler}>
      <div className={`w-[56px] h-[57px] ${selectedIconClass} backdrop-blur-[10px] flex justify-center items-center rounded-xl`}>
        <Image src={icon.url} alt="keyfeature__image" width={20} height={18}/>
      </div>
      <h1 className="text-white text-xl leading-8 font-semibold mt-7 pr-12">{title}</h1>
      <h4 className="text-[#ADADAD] mt-2 pr-12 text-[15px] leading-7">{description}</h4>
    </div>
  );
};
