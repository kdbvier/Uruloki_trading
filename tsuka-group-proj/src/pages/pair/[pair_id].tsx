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
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import { getOrdersByPair } from "@/lib/orders";
import { getTokenPrice } from "@/lib/token-price";
import { getBitqueryInitInfo } from "@/store/apps/bitquery-data";
import { getStrategies } from "@/store/apps/strategies";
import { getTokenPairInfo } from "@/store/apps/tokenpair-info";
import { getActiveOrdersbyTokenPair } from "@/store/apps/tokenpair-orders";
import { TokenPairPrice } from "@/store/apps/user-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createClient } from "graphql-ws";
import type { Order, TokenPairInfo } from "@/types";
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
import { getTokenNamesFromPair } from "@/lib/token-pair";
import { HistoricalDexTrades, getHistoricalDexTrades } from "@/lib/token-activity-feed";

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({
  orders,
  token_price,
  oldTokenPrice,
  sell24hrAgoTrades,
  buy24hrAgoTrades,
  baseAddress,
}: {
  orders: Order[];
  token_price: TokenPairPrice;
  oldTokenPrice: TokenPairPrice;
  sell24hrAgoTrades: number;
  buy24hrAgoTrades: number;
  baseAddress: string;
}) {

  
  const [buyTrades, setBuyTrades] = useState<any>(sell24hrAgoTrades);
  const [sellTrades, setSellTrades] = useState<any>(buy24hrAgoTrades);

interface Trade {
  side: string;
  tradeAmount: number;
  transaction: {
    index: number;
    txFrom: {
      address: string;
    };
  };
}

const getQuery = (
  tradeSide: string,
  baseAddress: string
): { query: string } => {
  return {
    query: `
    subscription {
      EVM(network: eth) {
        DEXTrades(
          where: {Trade: {Buy: {Currency: {SmartContract: {is: "${baseAddress}"}}}}}
        ) {
          Trade {
            ${tradeSide} {
              Currency {
                Symbol
                SmartContract
              }
              Price
              Amount
            }
          }
        }
      }
    }
    `,
  };
};

let WebSocketImpl: typeof WebSocket;

if (typeof WebSocket === "undefined") {
  WebSocketImpl = require("ws");
} else {
  WebSocketImpl = WebSocket;
}

const client = createClient({
  url: "wss://streaming.bitquery.io/graphql",
  webSocketImpl: WebSocketImpl,
  connectionParams: () => ({
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_BITQUERY_API_KEY,
    },
  }),
});

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
  const [pairAddress, setPairAddress] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const strategies = useAppSelector((state) => state.strategies.value);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    router.isReady && setIsLoading(false);
  }, [router.isReady]);

  // When this page becomes unmounted
  useEffect(() => {
    
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, []);

  useEffect(() => {
    setPairAddress(String(router.query.pair_id));
  }, [router]);

  useEffect(() => {
    dispatch(getStrategies());
  }, [dispatch]);

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
    dispatch(getTokenPairInfo(pairAddress as string));
    dispatch(getActiveOrdersbyTokenPair(pairAddress as string));
  }, [pairAddress, dispatch]);

  const handleEditModal = (show: boolean, id: number) => {
    setSelectedOrderId(id);
    setShowEditOrderModal(show ? 1 : 0);
    setIsEdit(true);
  };

  useEffect(() => {
    const onNext = (data: any) => {
      console.log("setSellTrades = ", data);

      const updatedTrades = data.data.EVM.DEXTrades.map((el: any) => {
        const obj = el.Trade;
        const side = Object.keys(el.Trade)[0];
        return {
          side,
          tradeAmount: obj[side].Amount,
          price: obj[side].Price,
          transaction: {
            txFrom: {
              address: obj[side].Currency.SmartContract,
            },
          },
        };
      });

      setSellTrades((prev: any) => [
        ...prev,
        ...updatedTrades.filter((el: any) => el.side.includes("Sell")),
      ]);
    };

    let unsubscribe = () => {
      /* complete the subscription */
    };
    
    (async () => {
      await new Promise<void>((resolve, reject) => {
        unsubscribe = client.subscribe(getQuery("Sell", baseAddress), {
          next: onNext,
          error: (err: any) => {
            console.log("Subscription error:", err);
            reject(err);
          },
          complete: () => {
            console.log("Subscription complete");
            resolve();
          },
        });
      });
    })();

    return () => {
      unsubscribe();
    };
  }, [baseAddress]);

  useEffect(() => {
    const onNext = (data: any) => {
      console.log("setBuyTrades = ", data);

      const updatedTrades = data.data.EVM.DEXTrades.map((el: any) => {
        const obj = el.Trade;
        const side = Object.keys(el.Trade)[0];
        return {
          side,
          tradeAmount: obj[side].Amount,
          price: obj[side].Price,
          transaction: {
            txFrom: {
              address: obj[side].Currency.SmartContract,
            },
          },
        };
      });
      setBuyTrades((prev: any) => [
        ...prev,
        ...updatedTrades.filter((el: any) => el.side.includes("Buy")),
      ]);
    };

    let unsubscribe = () => {
      /* complete the subscription */
    };

    (async () => {
      await new Promise<void>((resolve, reject) => {
        unsubscribe = client.subscribe(getQuery("Buy", baseAddress), {
          next: onNext,
          error: (err: any) => {
            console.log("Subscription error:", err);
            reject(err);
          },
          complete: () => {
            console.log("Subscription complete");
            resolve();
          },
        });
      });
    })();

    return () => {
      unsubscribe();
    };
  }, [baseAddress]);

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      <FullHeaderToken
        tokenPairInfo={tokenPairInfo}
        pair_address={String(pairAddress)}
        orders={orders}
        token_price={token_price}
        oldTokenPrice={oldTokenPrice}
      />
      <div className="hidden lg:grid grid-cols-11 gap-4">
        <div className="col-span-12 md:col-span-8">
          {/*<LiveGraphToken token={token.chain?.code} />*/}
          <LiveGraphToken />
          <div className="hidden md:grid grid-cols-8 gap-4">
            <div className="col-span-12 md:col-span-3">
              <PoolInfoToken token={token} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <OrderBookToken
                token={token}
                orders={orders}
              />
            </div>
          </div>
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
            <OrderBookToken token={token} orders={orders}/>
            <PoolInfoToken token={token} />
          </>
        )}
        <OrderBookToken token={token} orders={orders}/>
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
  const { pair_id } = context.query;

  let baseAddress = "";
  let quoteAddress = "";

  let tokenPairInfo: TokenPairInfo;
  let historicalDexTrades: HistoricalDexTrades;

  try {
    const tokenPairNamesResult = await getTokenNamesFromPair(pair_id as string);
    if(tokenPairNamesResult.success && tokenPairNamesResult.tokenPairInfo) {
      tokenPairInfo = tokenPairNamesResult.tokenPairInfo;

      let historicalDexTradesResult = await getHistoricalDexTrades(tokenPairInfo.baseToken.name, tokenPairInfo.pairedToken.name);
      if(historicalDexTradesResult.success && historicalDexTradesResult.historicalDexTrades) {
        historicalDexTrades = historicalDexTradesResult.historicalDexTrades;
      }
    }
  } catch (error) {
    console.log(error, "error");
  }  

  return {
    props: {
      orders,
      token_price,
      oldTokenPrice,
    },
  };
};
