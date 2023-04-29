import { FiSearch } from "react-icons/fi";

export interface FiltersSearchProps {
  // callback: () => void;
}

export const FiltersSearch: React.FC<FiltersSearchProps> = () => {
  return (
    <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
      <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
      <input
        type="text"
        className=" border border-tsuka-400 w-full md:w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[8px] focus:outline-0 placeholder-tsuka-300"
        placeholder="Find tokens..."
      />
    </div>
  );
};
