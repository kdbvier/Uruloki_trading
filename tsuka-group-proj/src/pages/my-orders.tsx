import { SidebarStrategies } from "@/components/strategies/sidebar.strategies";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import { DeletedAlertToken } from "@/components/ui/my-order/deleted-alert.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowDown, FiFilter, FiSearch } from "react-icons/fi";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { UserOrder } from "@/types/token-order.type";
import Strategies from "@/lib/api/strategies";
import { Strategy } from "@/types";
import Orders from "@/lib/api/orders";

export default function MyOrder() {
  const [openToggle, setOpenToggle] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);

  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [value, setValue] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const fetchStrategies = async () => {
      try {
        setLoading(true);
        const res = await Strategies.getStrategiesData();
        setStrategies(res);
        const res_1 = await Orders.getOrdersbyUserIdandFilters(1, openToggle ? "Open" : "Close", searchValue);
        setValue(res_1);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStrategies();
  }, [openToggle])

  const handleSearchChange = (e: any) => {
    console.log("changing");
    setSearchValue(e.target.value);
  };
  const handleSearchSubmit = () => {
    console.log("user pressed enter key");
    setLoading(true);
    Orders.getOrdersbyUserIdandFilters(1, openToggle ? "Open" : "Close", searchValue).then(res=>{
      setValue(res);
      setLoading(false);
    }).catch(err=>{
      setLoading(false);
    });
  };
  const handleEditModal = (show: boolean, id: number) => {
    setSelectedOrderId(id);
    setShowEditOrderModal(show);
  };
  const fetchOrders = async ()=> {
    setLoading(true);
    const res_1 = await Orders.getOrdersbyUserIdandFilters(1, openToggle ? "Open" : "Close", searchValue);
    setValue(res_1);
    setLoading(false);
  }
  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      {/* header */}
      <div className={`w-full flex justify-between items-center`}>
        <h1 className="hidden md:flex text-[40px] leading-[52px] font-medium text-tsuka-50 items-center flex-row gap-4">
          <Link
            href={"/strategies"}
            className={
              "hidden md:block text-[24px] leading-[52px] text-tsuka-200"
            }
          >
            My Setups
          </Link>
          <Link
            href={"/my-orders"}
            className={
              "hidden md:block text-[40px] leading-[52px] font-medium text-tsuka-50"
            }
          >
            My Orders
          </Link>
        </h1>
        <div className="w-full md:w-auto flex flex-wrap">
          <div className="w-full md:w-auto flex md:gap-1">
            <button
              className={`w-1/2 md:w-auto px-4 py-[11px] focus:outline-none bg-tsuka-500 ${
                openToggle ? "bg-tsuka-500 text-green-400" : "text-tsuka-300"
              } rounded-md text-sm`}
              onClick={() => setOpenToggle(true)}
            >
              Open Orders
            </button>
            <button
              className={`w-1/2 md:w-auto ml-1 px-4 py-[11px] focus:outline-none ${
                !openToggle ? "bg-tsuka-500 text-red-400" : "text-tsuka-300"
              } rounded-md text-sm`}
              onClick={() => setOpenToggle(false)}
            >
              Closed Orders
            </button>
          </div>
          <hr className="md:hidden w-full mt-3 mb-5 border-tsuka-500" />
          <div className="md:ml-4 flex w-full md:w-auto items-center gap-3 md:gap-1 lg:gap-3">
            <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
              <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
              <input
                type="text"
                className="w-full md:max-w-[140px] lg:max-w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300"
                placeholder="Find tokens......"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
            </div>
            <Link href={"/pair/1"}>
              <button
                type="button"
                onClick={() => console.log("clicked!")}
                className={`px-3 py-[11px] focus:outline-none bg-tsuka-500 text-tsuka-100 rounded-md text-sm flex items-center`}
              >
                <label className="mr-1 text-tsuka-200 text-base">
                  <FiFilter />
                </label>
                Filters
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="grid grid-cols-12 gap-x-5">
        {loading && (
          <div className="w-screen h-screen">
            <LoadingBox
              title="Processing orders"
              description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
            />
          </div>
        )}
        {!loading &&
          value.map((order, idx) => {
            if (idx > 2)
              return (
                <div
                  className={`${
                    showAll ? "" : "hidden md:block"
                  } col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer hover:scale-105 transition`}
                  key={idx}
                >
                  <OrderWidgetToken
                    name1={order.orders[0].baseTokenLongName}
                    code1={order.orders[0].baseTokenShortName}
                    name2={order.orders[0].pairTokenLongName}
                    code2={order.orders[0].pairTokenShortName}
                    status={order.orders[0].status}
                    orders={order.orders}
                    setShowEditOrderModal={handleEditModal}
                    setShowDeletedAlert={setShowDeletedAlert}
                  />
                </div>
              );
            return (
              <div
                className="col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer hover:scale-105 transition"
                key={idx}
              >
                <OrderWidgetToken
                  name1={order.orders[0].baseTokenLongName}
                  code1={order.orders[0].baseTokenShortName}
                  name2={order.orders[0].pairTokenLongName}
                  code2={order.orders[0].pairTokenShortName}
                  status={order.orders[0].status}
                  orders={order.orders}
                  setShowEditOrderModal={handleEditModal}
                  setShowDeletedAlert={setShowDeletedAlert}
                />
              </div>
            );
          })}
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
      {!showAll && (
        <div className="mt-4 flex justify-center">
          <button
            className="md:hidden flex items-center text-custom-primary font-medium py-2 px-3 bg-tsuka-500 rounded-md"
            onClick={() => setShowAll(true)}
          >
            <FiArrowDown className="text-lg mr-1" />
            Show more
          </button>
        </div>
      )}
      {showEditOrderModal && (
        <EditOrderToken
          setShowEditOrderModal={setShowEditOrderModal}
          selectedOrderId={selectedOrderId}
          closeHandler={() => {
            setShowEditOrderModal(false);
            setSelectedOrderId(-1);
          }}
          fetchOrders = {fetchOrders}
        />
      )}
      {showDeletedAlert && (
        <DeletedAlertToken setShowDeletedAlert={setShowDeletedAlert} />
      )}
    </div>
  );
}
