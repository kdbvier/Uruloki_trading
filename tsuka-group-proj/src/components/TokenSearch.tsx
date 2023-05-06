// components/TokenSearch.tsx

import { useState, useCallback } from "react";
import {
  searchTokensByName,
  getPairsByTokenAddress,
} from "../services/search-services";

export const TokenSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);

  const handleSearch = useCallback(async () => {
    console.log("search button click");
    const results = await searchTokensByName(searchQuery);
    console.log("results: there:: ", results);
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
                const pairAddresses = await getPairsByTokenAddress(
                  token.platform
                );
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
