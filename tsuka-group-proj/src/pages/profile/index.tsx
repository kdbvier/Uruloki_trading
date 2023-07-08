import { FiFilter, FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { getCards } from "@/@fake-data/card.fake-data";
import { CardType } from "@/types/card.type";
import Chart from "@/components/charts/ReactApexcharts";
import { WithdrawAndDepositModal } from "@/components/ui/profile/modal";
import { getChartData } from "@/@fake-data/chart.fake-data";
import { ChartType } from "@/types/chart.type";
import { getTokensInWallet } from "@/lib/bitquery/getTokensInWallet";

import { getConnectedAddress } from "@/helpers/web3Modal";
import { useUrulokiAPI } from "@/blockchain";
import { toast } from "react-toastify";
import { filterTokens } from "@/lib/token-filter";
import "react-toastify/dist/ReactToastify.css";
import { getAllOrders, getOrderByWalletAddress, getOrdersByWalletAddress } from "@/lib/orders";
import { orders } from "@prisma/client";

type PageProps = {
  tokenBalances: Array<CardType>;
  chartData: ChartType;
  userOrders: orders[];
};

export default function Profile({ tokenBalances, chartData, userOrders }: PageProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeposit, setIsDeposit] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletBalances, setWalletBalances] = useState<Array<CardType>>([]);
  const [chartDatas, setChartDatas] = useState<ChartType>({
    active: 0,
    out: 0
  });

  const { addFunds, withdrawFunds } = useUrulokiAPI();

  const handleOpenWidrawModal = () => {
    setShowModal(true);
    setIsDeposit(false);
  };

  const handleOpenDepositModal = () => {
    setIsDeposit(true);
    setShowModal(true);
  };

  const setChartData = () => {
    let active = 0;
    let out = 0;
    userOrders && userOrders.map((ele, id) => {
      if(ele.status === 'Active') {
        active++;
      } else if(ele.status === 'OutOfFunds') {
        out++;
      }
    })
    setChartDatas({
      active: active,
      out: out
    })
  }

  useEffect(() => {
    console.log("useEffect");
    console.log(userOrders);

    setChartData();
    
    const tokensInWallet = async (address: string) => {
      try {
        const res = await fetch(
          `/api/tokens/tokens-in-wallet?walletAddress=${address}`
        );
        const data = await res.json();
        console.log(data);
        return data;
      } catch (err) {
        console.log(err);
      }
      return null;
    };
    const getAddress = async () => {
      try {
        const address = await getConnectedAddress();
        if(address) setWalletAddress(address as string);
        
        var data;
        if(address) data = await tokensInWallet(address);
        setWalletBalances(filterTokens(data.payload?.walletBalances) ?? []);
      } catch (error) {
        console.log(error);
      }
    };

    getAddress();
  }, []);

  const backgroundInfo = [
    {
      color: "#4BDB4B",
      backgroundImage: "url('/imgs/b_15.svg')",
    },
    {
      color: "#E6007A",
      backgroundImage: "url('/imgs/b_10.svg')",
    },
    {
      color: "#F7931A",
      backgroundImage: "url('/imgs/b_13.svg')",
    },
    {
      color: "#282D35",
      backgroundImage: "url('/imgs/b_12.svg')",
    },
    {
      color: "#8A06D4",
      backgroundImage: "url('/imgs/b_2.svg')",
    },
    {
      color: "#E84142",
      backgroundImage: "url('/imgs/b_11.svg')",
    },
    {
      color: "#211F6D",
      backgroundImage: "url('/imgs/b_14.svg')",
    },
    {
      color: "#C2A633",
      backgroundImage: "url('/imgs/b_5.svg')",
    },
    {
      color: "#000000",
      backgroundImage: "url('/imgs/b_3.svg')",
    },
    {
      color: "#0033AD",
      backgroundImage: "url('/imgs/b_1.svg')",
    },
    {
      color: "#13B5EC",
      backgroundImage: "url('/imgs/b_8.svg')",
    },
    {
      color: "#00EF8B",
      backgroundImage: "url('/imgs/b_4.svg')",
    },
    {
      color: "#6747ED",
      backgroundImage: "url('/imgs/b_9.svg')",
    },
    {
      color: "#1B295E",
      backgroundImage: "url('/imgs/b_7.svg')",
    },
    {
      color: "#000000",
      backgroundImage: "url('/imgs/b_3.svg')",
    },
    {
      color: "#474DFF",
      backgroundImage: "url('/imgs/b_16.svg')",
    },
  ];

  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };

  const getBackgroundIndex = (token_name: string) => {
    const asciiKeys = [];
    var totalIndex = 0;
    var index = 0;
    for (var i = 0; i < token_name.length; i++) {
      asciiKeys.push(token_name[i].charCodeAt(0));

      totalIndex += asciiKeys[i];
      index = totalIndex % backgroundInfo.length;
    }
    return index;
  };

  const handleDepositWithdraw = (index: number) => {
    const { address, amount } = walletBalances[index];
    if (isDeposit) {
      if (address) {
        addFunds(address, amount).then((res) => {
          if (res?.msg === "success") {
            toast(res?.msg, { type: "success" });
          } else {
            toast(res?.msg, { type: "error" });
          }
          setShowModal(false);
        });
      }
    } else {
      if (address) {
        withdrawFunds(address, amount).then((res) => {
          if (res?.msg === "success") {
            toast(res?.msg, { type: "success" });
          } else {
            toast(res?.msg, { type: "error" });
          }
          setShowModal(false);
        });
      }
    }
  };

  return (
    <>
      <div className="relative px-4 md:px-10 pt-3 md:pt-10 pb-8">
        <div className="flex justify-between w-full items-center text-tsuka-50">
          <div className="hidden md:block font-Poppins-300 font-medium text-[40px] leading-[60px] ">
            Profile Overview
          </div>
        </div>
        <div className="w-full md:flex pt-[32px] flex-row-reverse	">
          <div className="flex flex-col md:ml-[21px] ">
            <button
              className="text-center py-[11px] px-[123px] font-medium font-['DM Sans'] text-[18.9px] leading-[25px] text-[#FFFFFF] bg-[#6FCF97]  rounded-md"
              onClick={handleOpenDepositModal}
            >
              Deposit
            </button>
            <button
              className="text-center py-[11px] px-[123px] font-medium font-['DM Sans'] text-[18.9px] leading-[25px] text-[#FFFFFF] bg-[#EB5757] hover:bg-[#EB1727] rounded-md my-[11px]"
              onClick={handleOpenWidrawModal}
            >
              Withdraw
            </button>
            <Chart data={chartDatas} />
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full grid gap-3 lg:grid-cols-3 mb-[40px] xl:grid-cols-4 md:grid-cols-2">
              {walletBalances?.map((card: CardType, key: number) => (
                <div
                  key={card.id}
                  className="flex justify-between py-[16px] px-[16px] rounded-md items-center gap-[27px] bg-no-repeat bg-cover	"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor:
                      backgroundInfo[getBackgroundIndex(card.name)].color,
                    backgroundImage:
                      backgroundInfo[getBackgroundIndex(card.name)]
                        ?.backgroundImage,
                  }}
                >
                  <TokenIconsToken
                    name={card.name}
                    shortName={card.shortName}
                    width={60}
                    height={60}
                  ></TokenIconsToken>
                  <div className="flex  font-medium text-[18.9px] landing-[25px] font-['DM Sans'] ">
                    <span>{card.value}</span>
                  </div>
                  <div className="flex  font-medium text-[18.9px] landing-[25px] font-['DM Sans'] ">
                    <span>{card.shortName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <WithdrawAndDepositModal
          open={showModal}
          handleClose={() => setShowModal(false)}
          callback={handleDepositWithdraw}
          Cards={walletBalances}
          walletBalances={walletBalances}
          isDeposit={isDeposit}
          backgroundInfo={backgroundInfo}
        />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const address = await getConnectedAddress();
  const getCardsData = await getCards();
  const chartData = await getChartData();
  const userOrders = await getOrderByWalletAddress('0xtest'); //change real address
  //const tokensInWallet = await getTokensInWallet("0x28Dc1b43ebCd1A0A0B5AB1E25Fac0b82551207ef")

  // Pass data to the page via props
  return { props: { tokenBalances: getCardsData, chartData: chartData, userOrders: userOrders } };
}
