import { useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { createClient } from "graphql-ws";
import { tokensData } from "@/@fake-data/token.fake-data";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { PoolInfoToken } from "@/components/tokens/pool-info.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { getToken } from "@/store/apps/token";
import { getUserOrder } from "@/store/apps/user-order";
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

const determineBaseAndQuote = (
  token0Address: string,
  token1Address: string
): { baseAddress: string; quoteAddress: string } => {
  const stablecoinAddresses = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
  ];

  let baseAddress, quoteAddress;
  if (stablecoinAddresses.includes(token0Address)) {
    baseAddress = token0Address;
    quoteAddress = token1Address;
  } else if (stablecoinAddresses.includes(token1Address)) {
    baseAddress = token1Address;
    quoteAddress = token0Address;
  } else {
    if (token0Address.toLowerCase() < token1Address.toLowerCase()) {
      baseAddress = token0Address;
      quoteAddress = token1Address;
    } else {
      baseAddress = token1Address;
      quoteAddress = token0Address;
    }
  }
  return { baseAddress, quoteAddress };
};

const getQuery = (tradeSide: string): { query: string } => {
  return {
    query: `
    subscription {
      EVM(network: eth) {
        DEXTrades(
          where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x514910771AF9Ca656af840dff83E8264EcF986CA"}}}}}
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
      "X-API-KEY": process.env.BIT_QUERY_API_KEY,
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

  const [currentToken, setCurrentToken] = useState<Token>();
  const [compareToken, setCompareToken] = useState<Token>();
  const [statusOrder, setStatusOrder] = useState(OrderStatusEnum.ACTIVE);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [buyTrades, setBuyTrades] = useState(sell24hrAgoTrades);
  const [sellTrades, setSellTrades] = useState(buy24hrAgoTrades);

  const { pair_id = id || "" } = router.query;

  useEffect(() => {
    dispatch(getToken(pair_id as string));
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

  useEffect(() => {
    const onNext = (data: any) => {
      const updatedTrades = data.data.EVM.DEXTrades.map((el: any) => {
        const obj = el.Trade;
        const side = Object.keys(el.Trade)[0];
        return {
          side,
          tradeAmount: obj[side].Amount,
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
        unsubscribe = client.subscribe(getQuery("Sell"), {
          next: onNext,
          error: (err) => {
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
  }, []);

  useEffect(() => {
    const onNext = (data: any) => {
      const updatedTrades = data.data.EVM.DEXTrades.map((el: any) => {
        const obj = el.Trade;
        const side = Object.keys(el.Trade)[0];
        return {
          side,
          tradeAmount: obj[side].Amount,
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
        unsubscribe = client.subscribe(getQuery("Buy"), {
          next: onNext,
          error: (err) => {
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
  }, []);

  const orders = useMemo((): Array<SingleOrder | RangeOrder> => {
    return userOrder[0]?.orders;
  }, [userOrder]);

  return (
    <div className="flex flex-col px-4 md:px-10 py-6">
      {token && (
        <>
          <FullHeaderToken token={token} />
          <div className="hidden lg:grid grid-cols-11 gap-4">
            {/* <div className="col-span-12 md:col-span-3">
              <CompareTokenChainToken token={token} networks={networks} />
            </div> */}
            <div className="col-span-12 md:col-span-8">
              <LiveGraphToken token={token.chain?.code} />
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
            <LiveGraphToken token={token.chain?.code} />
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
          </div>
        </>
      )}
      {showEditOrderModal && (
        <EditOrderToken
          isEdit={false}
          setShowEditOrderModal={setShowEditOrderModal}
          selectedOrderId={0} //TODO: Fix this
          closeHandler={() => {}} //TODO: Fix this
        />
      )}
    </div>
  );
};

export default PairDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  let baseAddress = "";
  let sell24hrAgoTrades = [];
  let buy24hrAgoTrades = [];

  try {
    const {
      data: {
        data: { ethereum },
      },
    } = await axios.post(
      "https://graphql.bitquery.io/",
      {
        query: `{
          ethereum {
            arguments(smartContractAddress: {is: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"}, smartContractEvent: {is: "PairCreated"}, options: { limit: 3 }) {
              block {
                height
              }
              argument {
                name
              }
              reference {
                address
              }
            }
          }
        }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "BQYYvTYy2UDpOqezZCl0NatKN7HKmtgc",
        },
      }
    );

    const token0 = ethereum.arguments?.find(
      (el: any) => el.argument.name === "token0"
    );
    const token1 = ethereum.arguments?.find(
      (el: any) => el.argument.name === "token1"
    );

    const addresses = determineBaseAndQuote(
      token0?.reference?.address,
      token1?.reference?.address
    );

    baseAddress = addresses.baseAddress;
    const quoteAddress = addresses.quoteAddress;

    const { data } = await axios.post(
      "https://graphql.bitquery.io/",
      {
        query: `{
          ethereum(network: ethereum) {
            dexTrades(
              baseCurrency: {is: "${baseAddress}"}
              quoteCurrency: {is: "${quoteAddress}"}
              options: {desc: ["block.timestamp.time", "transaction.index"], limit: 1}
            ) {
              block {
                height
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
              }
              baseCurrency {
                symbol
              }
              quoteCurrency {
                symbol
              }
              quotePrice
              tradeAmount(in: USD)
              quoteAmount
              side
              sellAmount(in: USD)
              buyAmount(in: USD)
              transaction {
                index
                txFrom {
                  address
                }
              }
              baseAmount(in: USD)
              count
              maker {
                address
              }
            }
          }
      }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "BQYYvTYy2UDpOqezZCl0NatKN7HKmtgc",
        },
      }
    );

    const dexTrades = data.data.ethereum.dexTrades || [];

    console.log("dexTrades = ", dexTrades);

    sell24hrAgoTrades = dexTrades.filter((el: any) => el.side === "SELL");
    buy24hrAgoTrades = dexTrades.filter((el: any) => el.side === "BUY");
  } catch (error) {
    console.log("err", error);
  }

  return {
    props: { sell24hrAgoTrades, buy24hrAgoTrades, baseAddress },
  };
};
