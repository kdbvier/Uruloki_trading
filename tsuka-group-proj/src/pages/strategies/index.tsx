import { StrategyBookStrategies } from "@/components/strategies/strategy-book.strategies";
import Strategies from "@/lib/api/strategies";
import { getStrategies } from "@/store/apps/strategies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Strategy } from "@/types";
import Link from "next/link";
import { useEffect } from "react";

export async function getServerSideProps() {
  const response = await Strategies.getStrategiesData();
  console.log(response);
  return { props: {data: response} }
}

export default function StrategyDetails({data}:{data:Strategy[]}) {
  console.log("data by serverside Props::: ", data);
  // console.log("response by serverside props: ", response);
  // const dispatch = useAppDispatch();
  // const {
  //   strategies: { value: strategies },
  // } = useAppSelector((state) => state);

  // useEffect(()=>{
  //   Strategies.getStrategiesData().then(data=>{
  //     console.log("dlfjdlfjlakjfldakjflakjfljgfgjfkhkghiurtjfgsjgf");
  //     console.log(data);
  //   })
  // }, [])
  // useEffect(() => {
  //   dispatch(getStrategies());
  // }, [dispatch]);
  // const strategies = response;

  const strategies = data as Strategy[]

  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      <div className="w-full gap-4 text-tsuka-300 flex py-2 mb-2 md:items-center flex-row">
        <Link
          href={"/strategies"}
          className={
            "hidden md:block text-[40px] leading-[52px] font-medium text-tsuka-50"
          }
        >
          My Setups
        </Link>
        <Link
          href={"/my-orders"}
          className={
            "hidden md:block text-[24px] leading-[52px] text-tsuka-200"
          }
        >
          My Orders
        </Link>
      </div>
      {strategies && <StrategyBookStrategies strategies={strategies} />}
    </div>
  );
}
