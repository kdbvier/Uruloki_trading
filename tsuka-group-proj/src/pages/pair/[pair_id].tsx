import { tokensData } from "@/@fake-data/token.fake-data";
import { SidebarStrategies } from "@/components/strategies/sidebar.strategies";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { DefaultButton } from "@/components/ui/buttons/default.button";
import { DeletedAlertToken } from "@/components/ui/my-order/deleted-alert.token"; 
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token; 
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";       
import { getBitqueryInitInfo } from "@/store/apps/bitquery-data";
import { getStrategies } from "@/store/apps/strategies";
import { getTokenPairInfo } from "@/store/apps/tokenpair-info";
import { getActiveOrdersbyTokenPair } from "@/store/apps/tokenpair-orders";
import { getToken, setPairAddress } from "@/store/apps/token";
import { getTokenPairPrice, getUserOrder } from "@/store/apps/user-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";     
import {
  OrderStatusEnum,    
  OrderTypeEnum,
  PriceTypeEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import type { Order } from "@/types";
import { Token } from "@/types/token.type";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { number } from "joi";
import HomePageTokens from "@/lib/api/tokens";
import { getOrdersByPair } from "@/lib/orders";
import { GetServerSideProps } from "next/types";

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({orders}: {orders: Order[]}) {
  const dispatch = useAppDispatch();
  const { value: token } = useAppSelector((state) => state.token);
  const tokenPairInfo = useAppSelector((state) => state.tokenPairInfo.value);
  const activeOrders = useAppSelector(
    (state) => state.tokenpairOrders.value.orders
  );
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pair_address, setPair_address] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const strategies = useAppSelector((state) => state.strategies.value);
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
    dispatch(getStrategies());
  }, [dispatch]);

  useEffect(() => {
    console.log("getTokenPairInfo", pair_address);
    console.log("pair_address.length)", (pair_address.length));
    console.log("typeof(pair_address)", typeof(pair_address));
    if(pair_address === "undefined" || pair_address.length === 0 ){
      return;
    }
    dispatch(getTokenPairInfo(pair_address as string));
  }, [dispatch, pair_address]);

  useEffect(() => {
    console.log("tokenPairInfo", tokenPairInfo);
    console.log("router.query.pair_id--------------------------",router.query.pair_id);
    // const pairInfo = HomePageTokens.getTokenPairInfo(router.query.pair_id as string);
    // console.log("pairInfo",pairInfo);
    const time = 15;
    const pairAddress = router.query.pair_id;
    if(!pairAddress){
      return;
    }
    const eachAddress = {
      base: tokenPairInfo.baseToken.address,
      quote: tokenPairInfo.pairedToken.address,
      pairAddress: pairAddress,
      time: time
    }
    dispatch(getBitqueryInitInfo(eachAddress));
  }, [tokenPairInfo]);
 

  useEffect(() => {
    dispatch(getTokenPairInfo(pair_address as string));
    dispatch(getActiveOrdersbyTokenPair(pair_address as string));
  }, [pair_address]);

  const handleEditModal = (show: boolean, id: number) => {
    setSelectedOrderId(id);
    setShowEditOrderModal(show ? 1 : 0);
    setIsEdit(true);
  };

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      <FullHeaderToken
        tokenPairInfo={tokenPairInfo}
        pair_address={String(pair_address)}
        orders={orders}
      />
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
          <DefaultButton
            label="Create an Order"
            callback={() => {
              setShowEditOrderModal(2);
              setIsEdit(false);
            }}
            filled={true}
            Icon={FiPlusCircle}
          />
          <OrderWidgetToken
            name1={tokenPairInfo.baseToken.name as string}
            code1={tokenPairInfo.baseToken.symbol as string}
            name2={tokenPairInfo.pairedToken.name as string}
            code2={tokenPairInfo.pairedToken.symbol as string}
            status={"Active" as OrderStatusEnum}
            orders={activeOrders.map((order) => ({
              id: order.order_id as number,
              budget: order.budget as number,
              price_type: order.price_type as PriceTypeEnum,
              order_type: order.order_type as OrderTypeEnum,
              status: order.status as OrderStatusEnum,
              is_continuous: order.is_continuous as boolean,
              baseTokenShortName: order.baseTokenShortName as string,
              baseTokenLongName: order.baseTokenLongName as string,
              pairTokenShortName: order.pairTokenShortName as string,
              pairTokenLongName: order.pairTokenLongName as string,
              price: order.single_price as number,
              prices: [order.from_price, order.to_price],
            }))}
            setShowEditOrderModal={handleEditModal}
            setShowDeletedAlert={setShowDeletedAlert}
          />
        </div>
      </div>
      <div className="block lg:hidden">
        <LiveGraphToken />
        <OrderWidgetToken
          name1={tokenPairInfo.baseToken.name as string}
          code1={tokenPairInfo.baseToken.symbol as string}
          name2={tokenPairInfo.pairedToken.name as string}
          code2={tokenPairInfo.pairedToken.symbol as string}
          status={"Active" as OrderStatusEnum}
          orders={activeOrders.map((order) => ({
            id: order.order_id as number,
            budget: order.budget as number,
            price_type: order.price_type as PriceTypeEnum,
            order_type: order.order_type as OrderTypeEnum,
            status: order.status as OrderStatusEnum,
            is_continuous: order.is_continuous as boolean,
            baseTokenShortName: order.baseTokenShortName as string,
            baseTokenLongName: order.baseTokenLongName as string,
            pairTokenShortName: order.pairTokenShortName as string,
            pairTokenLongName: order.pairTokenLongName as string,
            price: order.single_price as number,
            prices: [order.from_price, order.to_price],
          }))}
          setShowEditOrderModal={handleEditModal}
          setShowDeletedAlert={setShowDeletedAlert}
        />
        {token && (
          <>
            <OrderBookToken token={token} />
            <PoolInfoToken token={token} />
          </>
        )}
        <OrderBookToken token={token} />
        <PoolInfoToken token={token} />
      </div>
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
      {showEditOrderModal && (
        <EditOrderToken
          name1={tokenPairInfo.baseToken.name as string}
          code1={tokenPairInfo.baseToken.symbol as string}
          name2={tokenPairInfo.pairedToken.name as string}
          code2={tokenPairInfo.pairedToken.symbol as string}
          pair_address={pair_address}
          setShowEditOrderModal={setShowEditOrderModal}
          selectedOrderId={selectedOrderId}
          isEdit={showEditOrderModal === 1}
          closeHandler={() => {
            setShowEditOrderModal(0);
            setSelectedOrderId(-1);
          }}
        />
      )}
      {showDeletedAlert && (
        <DeletedAlertToken setShowDeletedAlert={setShowDeletedAlert} />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let orders: Order[];
  try {
    orders = await getOrdersByPair(context.query.pair_id as string, "Active");
  } catch (e) {
    orders = [];
  }

  return {
    props: {
      orders
    },
  };
}