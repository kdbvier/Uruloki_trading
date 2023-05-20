import _ from 'lodash';
import { SidebarStrategies } from "@/components/strategies/sidebar.strategies";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { DefaultButton } from "@/components/ui/buttons/default.button";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import { DeletedAlertToken } from "@/components/ui/my-order/deleted-alert.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import Orders from "@/lib/api/orders";
import Strategies from "@/lib/api/strategies";
import HomePageTokens from "@/lib/api/tokens";
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import { getOrdersByPair } from "@/lib/orders";
import { getTokenPrice } from "@/lib/token-price";
// import { getBitqueryInitInfo } from "@/store/apps/bitquery-data";
// import { getStrategies } from "@/store/apps/strategies";
// import tokenpairInfo, { getTokenPairInfo } from "@/store/apps/tokenpair-info";
import { getActiveOrdersbyTokenPair } from "@/store/apps/tokenpair-orders";
import { TokenPairPrice } from "@/store/apps/user-order";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { BitqueryData, Order, Strategy, TokenPairInfo } from "@/types";
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PriceTypeEnum,
} from "@/types/token-order.type";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { Token } from '@/types/token.type';
import { tokensData } from '@/@fake-data/token.fake-data';

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({
  orders,
  token_price,
  oldTokenPrice,
}: {
  orders: Order[];
  token_price: TokenPairPrice;
  oldTokenPrice: TokenPairPrice;
}) {
  // const dispatch = useAppDispatch();
  // const { value: token } = useAppSelector((state) => state.token);
  // const tokenPairInfo = useAppSelector((state) => state.tokenPairInfo.value);
  // const activeOrders = useAppSelector(
  //   (state) => state.tokenpairOrders.value.orders
  // );
  
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pairAddress, setPairAddress] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{
    const fetchStrategies = async () => {
      try {
        const res = await Strategies.getStrategiesData();
        setStrategies(res);
      } catch (err) {
        console.error(err);
      }
    };
    if(strategies.length===0){
      fetchStrategies();
    }
  }, [strategies]);

  const [tokenPairInfo, setTokenPairInfo] = useState<TokenPairInfo>();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  useEffect(()=>{
    const fetchTokenPairInfo_ActiveOrders = async () => {
      try {
        if(!pairAddress || _.isEmpty(pairAddress))
          return;
        const res = await HomePageTokens.getTokenPairInfo(pairAddress);
        setTokenPairInfo({...res});
        const res_1 = await Orders.getActiveOrdersbyTokenPair(pairAddress);
        setActiveOrders(res_1);
      } catch (err) {
        console.log("errors");
        console.error(err);
      }
    };

    fetchTokenPairInfo_ActiveOrders();

  }, [pairAddress])

  useEffect(() => {
    router.isReady && setIsLoading(false);
  }, [router.isReady]);

  const [token, setToken] = useState<Token>();
  useEffect(()=>{ 
    const fetchToken = async ()=>{
      try{
        const res = await tokensData.find((item) => item?.strategy_id === pairAddress)!;
      }catch(err){  
        console.error(err);
      }
    }
  },[pairAddress])
  // // When this page becomes unmounted
  // useEffect(() => {
    
  //   return () => {
  //     // Stop subscribing from the Bitquery
  //     stopBitqueryStream();
  //   };
  // }, []);

  useEffect(() => {
    setPairAddress(String(router.query.pair_id));
  }, [router]);

  // useEffect(()=>{
  //   const time = 15;
  //   const pairAddress = router.query.pair_id;
  //   if(!pairAddress){
  //     return;
  //   }
  //   if(!tokenPairInfo || _.isEmpty(tokenPairInfo)){
  //     return;
  //   }
  //   const eachAddress = {
  //     base: tokenPairInfo.baseToken.address,
  //     quote: tokenPairInfo.pairedToken.address,
  //     pairAddress: pairAddress,
  //     time: time
  //   }
  //   dispatch(getBitqueryInitInfo(eachAddress));
  // }, [tokenPairInfo])

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
    if(!tokenPairInfo || _.isEmpty(tokenPairInfo)){
      return;
    }
    const eachAddress = {
      base: tokenPairInfo.baseToken.address,
      quote: tokenPairInfo.pairedToken.address,
      pairAddress: pairAddress,
      time: time
    }
    // dispatch(getBitqueryInitInfo(eachAddress));
  }, [tokenPairInfo]);
 

  // useEffect(() => {
  //   dispatch(getTokenPairInfo(pairAddress as string));
  //   dispatch(getActiveOrdersbyTokenPair(pairAddress as string));
  // }, [pairAddress, dispatch]);

  const handleEditModal = (show: boolean, id: number) => {
    setSelectedOrderId(id);
    setShowEditOrderModal(show ? 1 : 0);
    setIsEdit(true);
  };

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      {tokenPairInfo&&<>
        <FullHeaderToken
          tokenPairInfo={tokenPairInfo}
          pair_address={String(pairAddress)}
          orders={orders}
          token_price={token_price}
          oldTokenPrice={oldTokenPrice}
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
          {/* <OrderBookToken token={token} />
          <PoolInfoToken token={token} /> */}
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
            pair_address={pairAddress}
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
        {isLoading && (
          <div className="w-screen h-screen z-40">
            <LoadingBox
              title="Loading data"
              description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
            />
          </div>
        )}
      </>}
      
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
  const initialTokenPairPrice: TokenPairPrice = {
    base_price: 0,
    quote_price: 0,
  };
  let token_price: TokenPairPrice = { ...initialTokenPairPrice };
  let oldTokenPrice: TokenPairPrice = { ...initialTokenPairPrice };
  try {
    token_price = (await getTokenPrice(
      context.query.pair_id as string
    )) as TokenPairPrice;
  } catch (err) {
    token_price = { ...initialTokenPairPrice };
  }

  try {
    oldTokenPrice = (await getTokenPrice(
      context.query.pair_id as string,
      true
    )) as TokenPairPrice;
  } catch (err) {
    oldTokenPrice = { ...initialTokenPairPrice };
  }

  return {
    props: {
      orders,
      token_price,
      oldTokenPrice,
    },
  };
};
