import { FiFilter, FiSearch } from "react-icons/fi";
import { useState } from "react";

export default function Profile() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-10 pb-8">
      <div className="flex justify-between w-full items-center text-tsuka-50">
        <div className="hidden md:block font-Poppins-300 font-medium text-[40px] leading-[60px] ">
          Profile Overview
        </div>
        <div className="md:ml-4 flex w-full md:w-auto items-center gap-3 md:gap-1 lg:gap-3">
          <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
            <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
            <input
              type="text"
              className="w-full md:max-w-[140px] lg:max-w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300"
              placeholder="Find tokens..."
              value={searchValue}
              onChange={handleSearchValue}
            />
          </div>
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
        </div>
      </div>
    </div>
  );
}
