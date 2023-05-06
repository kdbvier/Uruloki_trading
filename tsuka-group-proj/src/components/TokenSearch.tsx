// components/TokenSearch.tsx

import { getPairsByTokenAddress } from "@/lib/search_3";
import { useState, useCallback } from "react";
import { fuzzySearchERC20Tokens } from "../lib/search";
// import { searchERCTokens, searchTokensByName } from "../lib/search_1";
import { checkIfTokenIsErc20, checkIfTokenIsOnUniswap, searchTokensByName } from "../lib/search_4";
import { search22Tokens } from "../lib/search_2";
// import {fetchRecentTokenPairs} from '../lib/search'

export const TokenSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);

  const handleSearch = useCallback(async () => {
    console.log("search button click");
    // const results = await fuzzySearchERC20Tokens(searchQuery);
    // const results = await fetchRecentTokenPairs(250);
    // const results = await searchERCTokens(searchQuery);
    const results = await searchTokensByName(searchQuery);
    // const results = await checkIfTokenIsErc20("0xdac17f958d2ee523a2206206994597c13d831ec7")
    // const results1 = await checkIfTokenIsOnUniswap("0xdac17f958d2ee523a2206206994597c13d831ec7")
    // const results = await search22Tokens(searchQuery);
    console.log("results: there:: ", results, );
    setTokens(results);
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        placeholder="Search for tokens"
      />
      <button style={{ backgroundColor: "red" }} onClick={handleSearch}>
        Search
      </button>

      <ul style={{ backgroundColor: "white" }}>
        {tokens.map((token, index) => (
          <li key={index}>
            <button
              style={{ marginTop: 1, backgroundColor: "slateblue" }}
              onClick={async () => {
                const pairAddresses = await getPairsByTokenAddress(token.platform);
                console.log("pairAddresses are:: ", pairAddresses);
              }}
            >
              {token.name} ({token.symbol})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
