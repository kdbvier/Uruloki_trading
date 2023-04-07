import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";
import { TokensForm } from "@/components/forms/tokens.form";

export default function Home() {
  const titles = formItensData;
  const data = tokensData;
  const [inputToken, outputToken] = data.map((token) => {
    return { id: token.id, token: token.chain.code, icon: token.chain.icon };
  });

  const networks = ["ETH", "BSC", "POLYGON"];

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <p className="hidden md:block mx-4 text-3xl font-medium text-tsuka-50 ">
          Homepage
        </p>
        <form className="ml-auto w-full md:w-80 flex items-center">
          <label htmlFor="search-tokens" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="search-tokens"
              className="bg-tsuka-500 border border-tsuka-200 text-tsuka-50 text-sm rounded-md block w-full pl-10 p-2"
              placeholder="Find tokens..."
            />
          </div>
          <button
            type="submit"
            className="p-2.5 ml-2 text-sm font-medium text-tsuka-100 bg-tsuka-500 rounded-md hover:bg-tsuka-600 focus:outline-none"
          >
            Filters
          </button>
        </form>
      </div>
      <TokensForm title="Top Movers Tokens" data={{ titles, data }} />
    </div>
  );
}
