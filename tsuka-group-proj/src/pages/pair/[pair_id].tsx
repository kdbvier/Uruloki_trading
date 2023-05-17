import { useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { createClient } from "graphql-ws";
import { tokensData } from "@/@fake-data/token.fake-data";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { getToken, setPairAddress } from "@/store/apps/token";
import { getTokenPairPrice, getUserOrder } from "@/store/apps/user-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import { Token } from "@/types/token.type";
import { useRouter } from "next/router";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "@/components/ui/buttons/default.button";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import axios from "axios";
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import {
  getBitqueryInitInfo,
  getBitqueryStreamInfo,
} from "@/store/apps/bitquery-data";
import { getStrategies } from "@/store/apps/strategies";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { SidebarStrategies } from "@/components/strategies/sidebar.strategies";
import { getActiveOrdersbyTokenPair } from "@/store/apps/tokenpair-orders";
import { getTokenPairInfo } from "@/store/apps/tokenpair-info";

interface InputToken {
  id: string;
  token: string;
}

interface TokenDetailsProps {
  id: string;
  sell24hrAgoTrades: Trade[];
  buy24hrAgoTrades: Trade[];
  baseAddress: string;
}

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

const PairDetail: React.FC<TokenDetailsProps> = ({
  id,
  sell24hrAgoTrades,
  buy24hrAgoTrades,
  baseAddress,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { value: token } = useAppSelector((state) => state.token);
  const { value: userOrder } = useAppSelector((state) => state.userOrder);
  const tokenPairInfo = useAppSelector((state) => state.tokenPairInfo.value);
  const { value: bitquery } = useAppSelector((state) => state.bitquery);
  const [currentToken, setCurrentToken] = useState<Token>();
  const [compareToken, setCompareToken] = useState<Token>();
  const [statusOrder, setStatusOrder] = useState(OrderStatusEnum.ACTIVE);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [buyTrades, setBuyTrades] = useState(sell24hrAgoTrades);
  const [sellTrades, setSellTrades] = useState(buy24hrAgoTrades);

  const { pair_id = id || "" } = router.query;
  const [showSidebar, setShowSidebar] = useState(false);
  const [pair_address, setPair_address] = useState<string>("");

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
    dispatch(getTokenPairInfo(pair_address as string));
  }, [pair_address]);

  useEffect(() => {
    if (token) {
      dispatch(getUserOrder(token.id));
    }
    const currentToken = tokensData.find((item) => item.id === pair_id)!;
    const compareToken = tokensData.find((item) => item.id !== pair_id)!;
    setCurrentToken(currentToken);
    setCompareToken(compareToken);
    dispatch(getActiveOrdersbyTokenPair(pair_address as string));
  }, [dispatch, pair_id, token]);

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
      setSellTrades((prev) => [
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
      setBuyTrades((prev) => [
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

  const orders = useMemo((): Array<SingleOrder | RangeOrder> => {
    return userOrder[0]?.orders;
  }, [userOrder]);

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      <FullHeaderToken
        tokenPairInfo={tokenPairInfo}
        pair_address={String(pair_address)}
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
                buyTrades={buyTrades}
                sellTrades={sellTrades}
              />
            </div>
          </div>
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
          name1={tokenPairInfo.baseToken.name as string}
          code1={tokenPairInfo.baseToken.symbol as string}
          name2={tokenPairInfo.pairedToken.name as string}
          code2={tokenPairInfo.pairedToken.symbol as string}
          pair_address={pair_address}
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
    </div>
  );
};

export default PairDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pair_id } = context.query;

  let sell24hrAgoTrades = [];
  let buy24hrAgoTrades = [];
  let baseAddress = "";
  let quoteAddress = "";

  try {
    const res = await axios.get(
      `http://localhost:3000/api/tokens/token-pair?pair_address=${pair_id}`
    );
    baseAddress = res.data.payload.baseToken.address;
    quoteAddress = res.data.payload.pairedToken.address;
  } catch (error) {
    console.log(error, "error");
  }

  try {
    const { data } = await axios.post(
      "https://graphql.bitquery.io/",
      {
        query: `{
          ethereum(network: ethereum) {
            dexTrades(
              baseCurrency: {is: "${baseAddress}"}
              quoteCurrency: {is: "${quoteAddress}"}
              options: {desc: ["block.timestamp.time", "transaction.index"], limit: 10}
            ) {
              block {
                height
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
              }
              tradeAmount(in: BTC)
              side
              sellAmount(in: USD)
              buyAmount(in: USD)
              transaction {
                index
                txFrom {
                  address
                }
              }
            }
          }
      }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "BQYedcj8q0acU4h8q0CmF2rfIVZp9VOe",
        },
      }
    );

    const dexTrades = data?.data?.ethereum?.dexTrades.map((el: any) => {
      const amount = el.side === "SELL" ? el.sellAmount : el.buyAmount;
      return {
        tradeAmount: el.tradeAmount,
        side: el.side,
        price: amount,
        transaction: el.transaction,
      };
    });

    if (dexTrades && dexTrades.length) {
      sell24hrAgoTrades = dexTrades?.filter((el: any) => el.side === "SELL");
      buy24hrAgoTrades = dexTrades?.filter((el: any) => el.side === "BUY");
    }
  } catch (error) {}

  return {
    props: { sell24hrAgoTrades, buy24hrAgoTrades, baseAddress },
  };
};
