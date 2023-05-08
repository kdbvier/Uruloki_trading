import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TokenIconsToken } from "../tokens/token-icons.token";
import HomePageTokens from "@/lib/api/tokens";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface FiltersSearchProps {
  // callback: () => void;
}

export type FilterSearchItemType = {
  id: string;
  name: string;
  symbol: string;
  address: string;
};

const FilterSearchItem = ({
  item: { id, name, symbol, address },
}: {
  item: FilterSearchItemType;
}) => {
  const router = useRouter();
  return (
    <div
      className="flex items-center [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-tsuka-300 py-2 bg-tsuka-500 hover:bg-tsuka-400 cursor-pointer"
      onClick={() => router.push(`/pair/${address}`)}
    >
      <TokenIconsToken
        className="min-w-[30px] mr-4"
        name={name}
        shortName={symbol}
        width={30}
        height={30}
      />
      <div className="flex flex-col w-[calc(100%-46px)]">
        <div className="text-tsuka-50 text-lg w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </div>
        <div className="text-tsuka-300 w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {address}
        </div>
      </div>
    </div>
  );
};

export const FiltersSearch: React.FC<FiltersSearchProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FilterSearchItemType[]>([]);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = ev;
    setSearchQuery(value);
  };
  useEffect(() => {
    if (searchQuery.length >= 3) {
      setLoading(true);
      HomePageTokens.searchTokens(searchQuery)
        .then((res) => {
          setItems(res);
        })
        .catch((err) => {
          console.log("fetch token by name failed", err);
          setItems([]);
          toast.error("Fetch token by name failed");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchQuery]);
  useEffect(() => {
    const listener = (ev: MouseEvent) => {
      const { target } = ev;
      const thisElement = document.querySelector("#filterToken");
      if (thisElement?.contains(target as Node)) {
        setShowDropDownMenu(true);
      } else {
        setShowDropDownMenu(false);
      }
    };
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);
  return (
    <div className="grow md:grow-0 flex flex-col" id="filterToken">
      <div className="flex items-center text-sm text-tsuka-100">
        <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
        <input
          type="text"
          className=" border border-tsuka-400 w-full md:w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[8px] focus:outline-0 placeholder-tsuka-300"
          placeholder="Find tokens..."
          name="searchQuery"
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
      {showDropDownMenu && (
        <div className="relative">
          {loading ? (
            <div className="w-full bg-tsuka-500 py-2 rounded-xl shadow-[0_40px_50px_-15px_rgba(0,0,0,1)]">
              <img
                className="rotate mx-auto"
                src="/icons/loading.png"
                alt="loading"
                width={20}
                height={20}
              />
            </div>
          ) : (
            <div className="absolute top-0 w-[280px] max-h-[300px] overflow-y-scroll bg-tsuka-500 p-5 shadow-[0_40px_50px_-15px_rgba(0,0,0,1)] rounded-xl flex flex-col">
              {items.length ? (
                items.map((item) => <FilterSearchItem item={item} />)
              ) : (
                <div className="text-tsuka-50">Token not found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
