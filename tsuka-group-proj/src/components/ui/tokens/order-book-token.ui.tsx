import { numberWithCommas } from "@/helpers/comma.helper";
import Orders from "@/lib/api/orders";
import { TokenOrderBooks } from "@/types/token-order-books.type";
import { Token } from "@/types/token.type";
import { useEffect, useState } from "react";

export const OrderBookTokenUi: React.FC<{ token: Token }> = ({ token }) => {
  const [maxSum, setMaxSum] = useState(0);

  const [tokenOrdersBooks, setTokenOrdersBooks] = useState<TokenOrderBooks>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTokenOrderBooks = async () => {
      try {
        setLoading(true);
        const res = await Orders.getOrderBooks(token?.pair?.address as string);
        setTokenOrdersBooks(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTokenOrderBooks();
  }, []);

  useEffect(() => {
    let sellSum: number = 0,
      buySum: number = 0;
    tokenOrdersBooks?.sell?.forEach((item) => {
      sellSum += item.size;
    });
    tokenOrdersBooks?.buy?.forEach((item) => {
      buySum += item.size;
    });
    setMaxSum(Math.max(sellSum, buySum));
  }, [tokenOrdersBooks]);

  let sum: number;

  return (
    <div>
      {loading && "Loading..."}
      {!loading && tokenOrdersBooks && (
        <div className="p-4 flex gap-2">
          <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {[...(tokenOrdersBooks?.sell ?? [])]
                ?.sort((a, b) => b.price - a.price)
                ?.map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className="text-red-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                    >
                      <div className="absolute w-full rounded-lg mt-2 mr-4">
                        <div
                          className="bg-red-400/20 h-6 rounded text-start flex items-center px-2 ml-auto"
                          style={{
                            width: `${(sum * 100) / maxSum}%`,
                          }}
                        ></div>
                      </div>
                      <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                        {numberWithCommas(item.price)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {item.size.toFixed(2)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {numberWithCommas(sum)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USDT)</span>
                <span className="flex-1 px-4 py-2 text-end">Size (UDT)</span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USDT)</span>
              </div>
              {[...(tokenOrdersBooks?.buy ?? [])]
                ?.sort((a, b) => a.price - b.price)
                ?.map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className="text-green-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                    >
                      <div className="text-green-400 absolute w-full rounded-lg m-2 pr-4">
                        <div
                          className="bg-green-400/20 h-6 rounded text-start flex items-center px-2 mr-auto"
                          style={{
                            width: `${(sum * 100) / maxSum}%`,
                          }}
                        ></div>
                      </div>
                      <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                        {numberWithCommas(item.price)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {item.size.toFixed(2)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {numberWithCommas(sum)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
