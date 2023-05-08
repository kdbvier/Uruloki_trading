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
import { useEffect, useMemo, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { DefaultButton } from "@/components/ui/buttons/default.button";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import { getBitqueryInitInfo, getBitqueryStreamInfo } from "@/store/apps/bitquery-data";

interface InputToken {
  id: string;
  token: string;
}

export default function Pair({tranData}: any, { id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { value: token } = useAppSelector((state) => state.token);
  const { value: userOrder } = useAppSelector((state) => state.userOrder);
  const { value: bitquery } = useAppSelector((state) => state.bitquery);
  const router = useRouter();
  const [currentToken, setCurrentToken] = useState<Token>();
  const [compareToken, setCompareToken] = useState<Token>();
  const [statusOrder, setStatusOrder] = useState(OrderStatusEnum.ACTIVE);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const { pair_id } = router.query;

  // When this page becomes unmounted
  useEffect( () => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect");
    dispatch(getBitqueryInitInfo());
  }, [dispatch])

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
                  <OrderBookToken token={token} />
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
}
