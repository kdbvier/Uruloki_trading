import { tokensData } from "@/@fake-data/token.fake-data";
import { SidebarStrategies } from "@/components/strategies/sidebar.strategies";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { DefaultButton } from "@/components/ui/buttons/default.button";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import { getBitqueryInitInfo } from "@/store/apps/bitquery-data";
import { getStrategies } from "@/store/apps/strategies";
import { getToken } from "@/store/apps/token";
import { getOrdersbyTokenPair } from "@/store/apps/tokenpair-orders";
import { getUserOrder } from "@/store/apps/user-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import { Token } from "@/types/token.type";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({ tranData }: any, { id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { value: token } = useAppSelector((state) => state.token);
  const { value: userOrder } = useAppSelector((state) => state.userOrder);
  const { value: bitquery } = useAppSelector((state) => state.bitquery);
  const router = useRouter();
  const [currentToken, setCurrentToken] = useState<Token>();
  const [compareToken, setCompareToken] = useState<Token>();
  const [statusOrder, setStatusOrder] = useState(OrderStatusEnum.ACTIVE);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pair_address, setPair_address] = useState<String>("");

  let pair_id = "2";

  // When this page becomes unmounted
  useEffect(() => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, []);

  useEffect(() => {
    setPair_address(String(router.query.pair_id));
  }, [router]);

  useEffect(() => {
    console.log("useEffect");
    dispatch(getBitqueryInitInfo());
    dispatch(getStrategies());
  }, [dispatch]);
  
  const {
    strategies: { value: strategies },
  } = useAppSelector((state) => state);
  useEffect(() => {
    dispatch(getToken(pair_id as string));
    dispatch(getOrdersbyTokenPair(pair_id as string));
  }, [dispatch, pair_id]);

  useEffect(() => {
    if (token) {
      dispatch(getUserOrder(token.id));
    }
    const currentToken = tokensData.find((item) => item.id === pair_id)!;
    const compareToken = tokensData.find((item) => item.id !== pair_id)!;
    setCurrentToken(currentToken);
    setCompareToken(compareToken);
  }, [dispatch, pair_id, token]);

  const orders = useMemo((): Array<SingleOrder | RangeOrder> => {
    return userOrder[0]?.orders;
  }, [userOrder]);

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      {token && (
        <>
          <FullHeaderToken token={token} pair_address={String(pair_address)} />
          <div className="hidden lg:grid grid-cols-11 gap-4">
            {/* <div className="col-span-12 md:col-span-3">
              <CompareTokenChainToken token={token} networks={networks} />
            </div> */}
            <div className="col-span-12 md:col-span-8">
              <LiveGraphToken />
              {token && (
                <div className="hidden md:grid grid-cols-8 gap-4">
                  <div className="col-span-12 md:col-span-3">
                    <PoolInfoToken token={token} />
                  </div>
                  <div className="col-span-12 md:col-span-5">
                    <OrderBookToken token={token} />
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-12 md:col-span-3">
              {currentToken && compareToken && (
                <>
                  <DefaultButton
                    label="Create an Order"
                    callback={() => setShowEditOrderModal(true)}
                    filled={true}
                    Icon={FiPlusCircle}
                  />
                  <OrderWidgetToken
                    name1={currentToken?.chain.name as string}
                    code1={currentToken?.chain.code as string}
                    name2={compareToken?.chain.name as string}
                    code2={compareToken?.chain.code as string}
                    status={statusOrder}
                    orders={orders}
                  />
                </>
              )}
            </div>
          </div>
          <div className="block lg:hidden">
            <LiveGraphToken />
            {token && (
              <>
                {currentToken && compareToken && orders && (
                  <OrderWidgetToken
                    name1={currentToken?.chain.name as string}
                    code1={currentToken?.chain.code as string}
                    name2={compareToken?.chain.name as string}
                    code2={compareToken?.chain.code as string}
                    status={statusOrder}
                    orders={orders}
                  />
                )}
                <OrderBookToken token={token} />
                <PoolInfoToken token={token} />
              </>
            )}
          </div>
          {showEditOrderModal && (
            <EditOrderToken
              isEdit={false}
              name1={currentToken?.chain.name as string}
              code1={currentToken?.chain.code as string}
              name2={compareToken?.chain.name as string}
              code2={compareToken?.chain.code as string}
              pair_address={id}
              setShowEditOrderModal={setShowEditOrderModal}
              selectedOrderId={0} //TODO: Fix this
              closeHandler={() => {
                setShowEditOrderModal(false);
              }} //--//TODO: Fix this
            />
          )}
          <div className="fixed z-10 bottom-4 right-4 bg-tsuka-300 text-tsuka-50 rounded-full text-sm font-normal whitespace-nowrap">
            <button
              type="button"
              onClick={() => setShowSidebar(true)}
              className="w-full text-center focus:outline-none rounded-full text-sm p-4 inline-flex justify-center items-center mr-2"
            >
              <label className="mr-2">
                <HiOutlineArrowLongLeft size={24} />
              </label>
              Order & Strategies
            </button>
          </div>
          <SidebarStrategies
            open={showSidebar}
            handleOpen={() => setShowSidebar(false)}
            strategies={strategies!}
          />
        </>
      )}
    </div>
  );
}
