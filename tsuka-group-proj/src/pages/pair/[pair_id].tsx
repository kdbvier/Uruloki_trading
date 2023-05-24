import _ from "lodash";
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
import { getLiveDexTrades } from "@/lib/bitquery/dexTradesLiveStream";
import Orders from "@/lib/api/orders";
import Strategies from "@/lib/api/strategies";
import HomePageTokens from "@/lib/api/tokens";
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import { getOrdersByPair } from "@/lib/orders";
import {
  HistoricalDexTrades,
  getHistoricalDexTrades,
} from "@/lib/token-activity-feed";
import { getTokenNamesFromPair } from "@/lib/token-pair";
import { getTokenPrice } from "@/lib/token-price";
// import { getBitqueryInitInfo } from "@/store/apps/bitquery-data";
// import { getStrategies } from "@/store/apps/strategies";
// import tokenpairInfo, { getTokenPairInfo } from "@/store/apps/tokenpair-info";
import { getActiveOrdersbyTokenPair } from "@/store/apps/tokenpair-orders";
import { TokenPriceInPair } from "@/types";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { BitqueryData, Order, Strategy, TokenPairInfo } from "@/types";
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PriceTypeEnum,
} from "@/types/token-order.type";
import { createClient } from "graphql-ws";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModifiedOrder } from "@/lib/setups";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { Token } from "@/types/token.type";
import { tokensData } from "@/@fake-data/token.fake-data";

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({
  orders,
  token_price,
  oldTokenPrice,
  historicalDexTrades,
  tokenPairInfo,
}: {
  orders: Order[];
  token_price: number;
  oldTokenPrice: number;
  historicalDexTrades: Array<HistoricalDexTrades>;
  tokenPairInfo: TokenPairInfo
}) {
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

  const extractTrades = (data: any): any[] => {
    return data.data.EVM.DEXTrades.map((trade: any) => {
      const obj = trade.Trade;
      console.log("extractTrades");
      console.log(obj);
      const side = Object.keys(trade.Trade)[0];
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
  };

  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pairAddress, setPairAddress] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dexTrades, setDexTrades] =
    useState<HistoricalDexTrades[]>(historicalDexTrades);
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const walletAddress = await getConnectedAddress();
        const res = await Strategies.getStrategiesData(walletAddress as string);
        setStrategies(res);
      } catch (err) {
        console.error(err);
      }
    };
    if (strategies.length === 0) {
      fetchStrategies();
    }
  }, [strategies]);

  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  useEffect(() => {
    const fetchTokenPairInfo_ActiveOrders = async () => {
      try {
        if (!pairAddress || _.isEmpty(pairAddress)) return;
        const walletAddress: string = (await getConnectedAddress()) as string;
        const res_1 = await Orders.getActiveOrdersbyTokenPair({
          tokenpair: pairAddress,
          walletAddress,
        });
        setActiveOrders(res_1);
      } catch (err) {
        console.log("errors");
        console.error(err);
      }
    };

    fetchTokenPairInfo_ActiveOrders();
  }, [pairAddress]);

  useEffect(() => {
    router.isReady && setIsLoading(false);
  }, [router.isReady]);

  const [token, setToken] = useState<Token>();
  useEffect(() => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, [pairAddress]);
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
    console.log(
      "router.query.pair_id--------------------------",

      router.query.pair_id
    );
    // const pairInfo = HomePageTokens.getTokenPairInfo(router.query.pair_id as string);
    // console.log("pairInfo",pairInfo);
    const time = 15;
    const pairAddress = router.query.pair_id;
    if (!pairAddress) {
      return;
    }
    if (!tokenPairInfo || _.isEmpty(tokenPairInfo)) {
      return;
    }
    const eachAddress = {
      base: tokenPairInfo.baseToken?.address,
      quote: tokenPairInfo.pairedToken?.address,
      pairAddress: pairAddress,
      time: time,
    };
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

  useEffect(() => {
    const onNext = (data: any) => {
      console.log("setSellTrades = ", data);

      const updatedTrades = extractTrades(data);

      setDexTrades((prev: Array<HistoricalDexTrades>) => [
        ...prev,
        ...updatedTrades,
      ]);
    };

    let unsubscribe = () => {};
    (async () => {
      await new Promise<void>((resolve, reject) => {
        unsubscribe = client.subscribe(getLiveDexTrades(tokenPairInfo.baseToken?.address ?? ""), {
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
  }, [tokenPairInfo]);

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      <ToastContainer />
      {tokenPairInfo && (
        <FullHeaderToken
          tokenPairInfo={tokenPairInfo}
          pair_address={String(pairAddress)}
          orders={orders}
          token_price={token_price}
          oldTokenPrice={oldTokenPrice}
          token={token}
          setToken={setToken}
        />
      )}
      <div className="hidden lg:grid grid-cols-11 gap-4">
        <div className="col-span-12 md:col-span-8">
          {/*<LiveGraphToken token={token.chain?.code} />*/}
          <LiveGraphToken />
          <div className="hidden md:grid grid-cols-8 gap-4">
            <div className="col-span-12 md:col-span-3">
              <PoolInfoToken token={token as Token} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <OrderBookToken
                dexTrades={dexTrades}
                tokens={[
                  {
                    value: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
                    // value: orders[0].pair_address as string,
                    label:
                      orders[0]?.baseTokenShortName == "USDT" ||
                      orders[0]?.baseTokenShortName == "USDC" ||
                      orders[0]?.baseTokenShortName == "WETH" ||
                      orders[0]?.baseTokenShortName == "DAI"
                        ? `${orders[0]?.pairTokenShortName}/${orders[0]?.baseTokenShortName}`
                        : `${orders[0]?.baseTokenShortName}/${orders[0]?.pairTokenShortName}`,
                  },
                ]}
                orders={[
                  {
                    network: "Ethereum",
                    name1: orders[0]?.baseTokenLongName ?? "",
                    code1: orders[0]?.baseTokenShortName ?? "",
                    name2: orders[0]?.pairTokenLongName ?? "",
                    code2: orders[0]?.pairTokenShortName ?? "",
                    pair_address: pairAddress,
                    orders: orders.map(
                      (order) =>
                        ({
                          ...order,
                          id: order.order_id,
                          price: order.single_price ?? 0,
                          prices: [order.from_price ?? 0, order.to_price ?? 0],
                        } as ModifiedOrder)
                    ),
                  },
                ]}
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
            name1={tokenPairInfo?.baseToken?.name as string}
            code1={tokenPairInfo?.baseToken?.symbol as string}
            name2={tokenPairInfo?.pairedToken?.name as string}
            code2={tokenPairInfo?.pairedToken?.symbol as string}
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
          name1={tokenPairInfo?.baseToken?.name as string}
          code1={tokenPairInfo?.baseToken?.symbol as string}
          name2={tokenPairInfo?.pairedToken?.name as string}
          code2={tokenPairInfo?.pairedToken?.symbol as string}
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
      {showEditOrderModal && (
        <EditOrderToken
          name1={tokenPairInfo?.baseToken?.name as string}
          code1={tokenPairInfo?.baseToken?.symbol as string}
          name2={tokenPairInfo?.pairedToken?.name as string}
          code2={tokenPairInfo?.pairedToken?.symbol as string}
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
  let tokenPairInfo: TokenPairInfo = {};
  let historicalDexTrades: Array<HistoricalDexTrades> = [];
  try {
    orders = await getOrdersByPair(context.query.pair_id as string, "Active");
  } catch (e) {
    orders = [];
  }
  const initialTokenPriceInPair: TokenPriceInPair = {
    base_price: 0,
    quote_price: 0,
  };
  let token_price: TokenPriceInPair = { ...initialTokenPriceInPair };
  let oldTokenPrice: TokenPriceInPair = { ...initialTokenPriceInPair };
  try {
    token_price = (await getTokenPrice(
      context.query.pair_id as string
    )) as TokenPriceInPair;
  } catch (err) {
    token_price = { ...initialTokenPriceInPair };
  }

  try {
    oldTokenPrice = (await getTokenPrice(
      context.query.pair_id as string,
      true
    )) as TokenPriceInPair;
  } catch (err) {
    oldTokenPrice = { ...initialTokenPriceInPair };
  }
  const { pair_id } = context.query;

  try {
    const tokenPairNamesResult = await getTokenNamesFromPair(pair_id as string);

    if (tokenPairNamesResult.success && tokenPairNamesResult.tokenPairInfo) {
      tokenPairInfo = tokenPairNamesResult.tokenPairInfo;

      let historicalDexTradesResult = await getHistoricalDexTrades(
        tokenPairInfo.baseToken?.address as string,
        tokenPairInfo.pairedToken?.address as string
      );

      if (
        historicalDexTradesResult.success &&
        historicalDexTradesResult.historicalDexTrades
      ) {
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
      tokenPairInfo,
      historicalDexTrades,
    },
  };
};
