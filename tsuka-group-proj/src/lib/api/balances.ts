import axios from "axios"

export async function getTokensWithPotentialBalance (walletAddress: string): Promise<Array<string>> {
    const res = await axios.get(`/api/tokens/balances/${walletAddress}`)
    console.log(res.data.payload)
    return res.data.payload
}