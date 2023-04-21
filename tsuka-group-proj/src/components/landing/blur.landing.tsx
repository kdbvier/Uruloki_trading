export interface BlurProps {
  radius: number;
  left: number;
  top: number;
  color: string;
  blurSize: number;
}

export const BlurLanding: React.FC<BlurProps> = ({
  radius,
  left,
  top,
  color,
  blurSize
}) => {
  // w-[${radius}px] h-[${radius}px] bg-[${color}] blur-[${blurSize}px] left-[${left}px] top-[${top}px]
  // const  divStyle = { width: `${radius}px`};
  const  divStyle = { width: `${radius}px`, height: `${radius}px`, backgroundColor: `${color}`, left: `${left}px`, top: `${top}px`, };
  const blurClass = `absolute inset-0 flex justify-center items-center  rounded-full  filter blur-[200px]  h-[393px] text-white bg-[#004B35] left-[94px] top-[-84px]` as string;
  console.log("blurClass: ", blurClass)
  return (
    <div className="w-[1440px] bg-tsuka-700 py-4 overflow-hidden h-screen">
      <div className="px-28 justify-center text-center relative">
        {/* <div className={`${blurClass}` + `w-[${radius}px]`}> */}
        <div className={`${blurClass}`} style = {divStyle} >
        {/* <div className="absolute inset-0 flex justify-center items-center w-[393px] h-[393px] rounded-full bg-[#004B35] filter blur-[200px] left-[94px] top-[-84px]"> */}
          {blurClass}
        </div>    
        <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px]">
          <h1 className=" text-white bg-tsuka-500 text-xs font-normal text-center rounded-full pl-[12px] py-[6px] pr-[18px]">
            {"Should be displayed"}
          </h1>
        </div>   
      </div>
    </div>
  );
};
