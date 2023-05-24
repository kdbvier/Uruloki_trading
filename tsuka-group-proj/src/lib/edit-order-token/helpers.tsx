import { Order, TokenPriceInPair } from "@/types"
import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export const getPairPriceInfo = async (selectedOrder: Order, setTokenPairPriceInfo: Dispatch<SetStateAction<TokenPriceInPair>>) => {
  const {data} = await axios.post("api/tokens/token-pair-price", {
    pair_address: selectedOrder.pair_address
  })

  setTokenPairPriceInfo(data.payload ?? {base_price: 0, quote_price: 0})
}