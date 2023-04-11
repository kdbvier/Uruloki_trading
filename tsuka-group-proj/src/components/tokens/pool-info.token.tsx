import { getPoolInfo } from "@/store/apps/pool-info";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { FiArrowDown } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";

export interface PoolInfoTokenProps {
  token: {
    id: string;
  };
}

export const PoolInfoToken: React.FC<PoolInfoTokenProps> = ({ token }) => {
  const dispatch = useAppDispatch();
  const {
    value: { pool },
    status,
  } = useAppSelector((state) => state.poolInfo);

  useEffect(() => {
    dispatch(getPoolInfo(token.id));
  }, [dispatch, token]);

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-6">
      <p className="text-tsuka-50 text-xl font-semibold mb-6">Pool Info</p>
      {status === "loading" && "Loading..."}
      {status === "ok" && pool && (
        <div className="flex flex-col text-sm">
          <p className="mb-4 grid grid-cols-2">
            <label>Total Liquidity:</label>
            <label className="text-tsuka-50">
              ${pool.totalLiq.value}
              {pool.totalLiq.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>24 Volume:</label>
            <label className="text-tsuka-50">
              ${pool.dayVolume.value}
              {pool.dayVolume.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Market Cap:</label>
            <label className="text-tsuka-50">
              ${pool.marketCap.value}
              {pool.marketCap.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Circ. Supply:</label>
            <label className="text-tsuka-50">
              {pool.circSupply.value}
              {pool.circSupply.unit} {pool.circSupply.code}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Total Market Cap:</label>
            <label className="text-tsuka-50">
              ${pool.totalMarketCap.value}
              {pool.totalMarketCap.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Total Supply:</label>
            <label className="text-tsuka-50">
              {pool.totalSupply.value}
              {pool.totalSupply.unit} {pool.totalSupply.code}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Holders:</label>
            <label className="text-tsuka-50">
              {pool.holders.value}
              {pool.holders.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Total TX:</label>
            <label className="text-tsuka-50">
              {pool.totalTx.value}
              {pool.totalTx.unit}
            </label>
          </p>
        </div>
      )}

      <DefaultButton
        label="Show more"
        callback={() => console.log("default click")}
        Icon={FiArrowDown}
      />
    </div>
  );
};
