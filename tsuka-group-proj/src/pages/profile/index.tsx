import { FiFilter, FiSearch } from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";
export default function Profile() {
  const [searchValue, setSearchValue] = useState("");

  interface ICards {
    id: number;
    image: any;
    value: any;
    title: string;
    color: string;
    backgroundColor: string;
    backgroundImage: string;
  }

  const cards = [
    {
      id: 1,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Base.png",
      color: "#131820",
      backgroundColor: "#4BDB4B",
      backgroundImage: "url('/imgs/bBase.png')",
    },
    {
      id: 2,
      value: "6.950",
      title: "PLKD",
      image: "/imgs/Protocol Icon.png",
      color: "#FFFFFF",
      backgroundColor: "#E6007A",
      backgroundImage: "url('/imgs/background_1.png')",
    },
    {
      id: 3,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_2.png",
      color: "#131820",
      backgroundColor: "#F7931A",
      backgroundImage: "url('/imgs/background_2.png')",
    },
    {
      id: 4,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_3.png",
      color: "#FFFFFF",
      backgroundColor: "#282D35",
      backgroundImage: "url('/imgs/background_3.png')",
    },
    {
      id: 5,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_4.png",
      color: "#FFFFFF",
      backgroundColor: "#8A06D4",
      backgroundImage: "url('/imgs/background_4.png')",
    },
    {
      id: 6,
      value: "6.950",
      title: "PLKD",
      image: "/imgs/Protocol Icon_4.png",
      color: "#FFFFFF",
      backgroundColor: "#E84142",
      backgroundImage: "url('/imgs/background_5.png')",
    },
    {
      id: 7,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_6.png",
      color: "#FFFFFF",
      backgroundColor: "#211F6D",
      backgroundImage: "url('/imgs/background_6.png')",
    },
    {
      id: 8,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_6.png",
      color: "#131820",
      backgroundColor: "#C2A633",
      backgroundImage: "url('/imgs/background_7.png')",
    },
    {
      id: 9,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_7.png",
      color: "#FFFFFF",
      backgroundColor: "#000000",
      backgroundImage: "url('/imgs/background_8.png')",
    },
    {
      id: 10,
      value: "6.950",
      title: "PLKD",
      image: "/imgs/Protocol Icon_8.png",
      color: "#FFFFFF",
      backgroundColor: "#0033AD",
      backgroundImage: "url('/imgs/background_9.png')",
    },
    {
      id: 11,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_9.png",
      color: "#131820",
      backgroundColor: "#13B5EC",
      backgroundImage: "url('/imgs/background_10.png')",
    },
    {
      id: 12,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_10.png",
      color: "#131820",
      backgroundColor: "#00EF8B",
      backgroundImage: "url('/imgs/background_11.png')",
    },
    {
      id: 13,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_11.png",
      color: "#FFFFFF",
      backgroundColor: "#6747ED",
      backgroundImage: "url('/imgs/background_12.png')",
    },
    {
      id: 14,
      value: "6.950",
      title: "PLKD",
      image: "/imgs/Protocol Icon_12.png",
      color: "#FFFFFF",
      backgroundColor: "#1B295E",
      backgroundImage: "url('/imgs/background_13.png')",
    },
    {
      id: 15,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_13.png",
      color: "#131820",
      backgroundColor: "#13B5EC",
      backgroundImage: "url('/imgs/background_14.png')",
    },
    {
      id: 16,
      value: "6.950",
      title: "ANCH",
      image: "/imgs/Protocol Icon_14.png",
      color: "#F73E40",
      backgroundColor: "#474DFF",
      backgroundImage: "url('/imgs/background_15.png')",
    },
  ];

  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-10 pb-8">
      <div className="flex justify-between w-full items-center text-tsuka-50">
        <div className="hidden md:block font-Poppins-300 font-medium text-[40px] leading-[60px] ">
          Profile Overview
        </div>
        <div className="md:ml-4 flex w-full md:w-auto items-center gap-3 md:gap-1 lg:gap-3">
          <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
            <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
            <input
              type="text"
              className="w-full md:max-w-[140px] lg:max-w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300"
              placeholder="Find tokens..."
              value={searchValue}
              onChange={handleSearchValue}
            />
          </div>
          <button
            type="button"
            onClick={() => console.log("clicked!")}
            className={`px-3 py-[11px] focus:outline-none bg-tsuka-500 text-tsuka-100 rounded-md text-sm flex items-center`}
          >
            <label className="mr-1 text-tsuka-200 text-base">
              <FiFilter />
            </label>
            Filters
          </button>
        </div>
      </div>
      <div className="w-full md:flex pt-[32px] flex-row-reverse	">
        <div className="flex flex-col ml-[21px]">
          <div className="py-[11px] px-[123px] font-medium font-['DM Sans'] text-[18.9px] leading-[25px] text-[#FFFFFF] bg-[#6FCF97] cursor-pointer rounded-md">
            Deposit
          </div>
          <div className="py-[11px] px-[123px] font-medium font-['DM Sans'] text-[18.9px] leading-[25px] text-[#FFFFFF] bg-[#EB5757] cursor-pointer rounded-md mt-[11px]">
            Withdraw
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className=" md:grid md:grid-cols-4 gap-3 mb-[40px]">
            {cards.map((card: ICards, key: number) => (
              <div
                key={card.id}
                className="flex py-[16px]  px-[16px] rounded-md items-center gap-[27px] bg-no-repeat	"
                style={{
                  color: card.color,
                  backgroundColor: card.backgroundColor,
                  backgroundImage: card.backgroundImage,
                }}
              >
                <Image
                  src={card.image}
                  alt=""
                  width="60"
                  height="60"
                  className="fill-current"
                />
                <div className="font-medium text-[18.9px] landing-[25px] font-['DM Sans'] ">
                  {card.value}
                </div>
                <div className="font-medium text-[18.9px] landing-[25px] font-['DM Sans'  ]">
                  {card.title}
                </div>
              </div>
            ))}
          </div>
          <div className="py-[11px] px-[50.25px] font-semibold font-Inter-400 text-[14px] leading-[17px] text-[#F7931A] bg-[#1F2333] cursor-pointer">
            Load More
          </div>
        </div>
      </div>
    </div>
  );
}
