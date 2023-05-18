import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderStrategies } from "@/components/ui/strategies/full-header.strategies";
import { getStrategies } from "@/store/apps/strategies";
import { getTokenByStrategyId } from "@/store/apps/token";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
} from "react-icons/hi2";

export default function StrategyDetails({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [showIndex, setShowIndex] = useState(0);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const router = useRouter();
  const { id: strategyId = id || "" } = router.query;
  const [token, setToken] = useState(null);
  const [strategyDetails] = useAppSelector((state) =>
    state.strategies.value.filter(({ id }) => id === strategyId)
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handlePrevIndex = useCallback(() => {
    setShowIndex((prev) => prev - 1);
  }, []);

  const handleNextIndex = useCallback(() => {
    setShowIndex((prev) => prev + 1);
  }, []);

  const handleEditModal = (show: boolean, id: number) => {
    console.log(show, id);
    setSelectedOrderId(id);
    setShowEditOrderModal(show);
  };

  useEffect(() => {
    dispatch(getTokenByStrategyId(strategyId as string));
  }, [dispatch, strategyId]);

  useEffect(() => {
    dispatch(getStrategies());
  }, [dispatch, strategyId]);

  useEffect(() => {
    dispatch(getStrategies());
  }, []);

  return (
    <div className="flex flex-col">
      {strategyDetails && (
        <div className="p-8">
          <FullHeaderStrategies strategyDetails={strategyDetails} />
          <div className="hidden md:grid grid-cols-9 gap-4">
            {strategyDetails?.orderTokens?.map((item, index) => (
              <div key={index} className="col-span-9 md:col-span-3">
                <OrderWidgetToken
                  name1={item.name1}
                  code1={item.code1}
                  name2={item.name2}
                  code2={item.code2}
                  status={item.status}
                  orders={item.orders}
                  setShowEditOrderModal={handleEditModal}
                  setShowDeletedAlert={setShowDeletedAlert}
                />
              </div>
            ))}
          </div>
          <div className="relative md:hidden">
            <button
              type="button"
              disabled={showIndex <= 0}
              onClick={handlePrevIndex}
              className={`${
                showIndex <= 0 ? "hidden" : ""
              } absolute flex p-2 rounded-full bg-tsuka-400 shadow-xl text-tsuka-50 top-[50%] -left-6`}
            >
              <label>
                <HiOutlineArrowLongLeft size={24} />
              </label>
            </button>
            {strategyDetails?.orderTokens?.map(
              (item, index) =>
                showIndex === index && (
                  <div key={index} className="col-span-9">
                    <OrderWidgetToken
                      name1={item.name1}
                      code1={item.code1}
                      name2={item.name2}
                      code2={item.code2}
                      status={item.status}
                      orders={item.orders}
                      setShowEditOrderModal={handleEditModal}
                      setShowDeletedAlert={setShowDeletedAlert}
                    />
                  </div>
                )
            )}
            <button
              type="button"
              disabled={showIndex >= strategyDetails?.orderTokens?.length - 1}
              onClick={handleNextIndex}
              className={`${
                showIndex >= strategyDetails?.orderTokens?.length - 1
                  ? "hidden"
                  : ""
              } absolute flex p-2 rounded-full bg-tsuka-400 shadow-xl text-tsuka-50 top-[50%] -right-6`}
            >
              <label>
                <HiOutlineArrowLongRight size={24} />
              </label>
            </button>
          </div>
          {showEditOrderModal && (
            <EditOrderToken
              setShowEditOrderModal={setShowEditOrderModal}
              selectedOrderId={selectedOrderId}
              closeHandler={() => {
                setShowEditOrderModal(false);
                setSelectedOrderId(-1);
              }}
            />
          )}
          {token && <OrderBookToken token={token} order={[]}/>}
        </div>
      )}
    </div>
  );
}
