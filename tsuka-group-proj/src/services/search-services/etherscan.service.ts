import axios from 'axios';

export async function checkIfTokenIsErc20(address: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`);
    const contractABI = JSON.parse(response.data.result);
    const erc20Functions = ['totalSupply', 'balanceOf', 'transfer', 'transferFrom', 'approve', 'allowance'];

    return erc20Functions.every((funcName) =>
      contractABI.some((func: any) => func.type === 'function' && func.name === funcName)
    );
  } catch (error) {
    console.error(`Error checking if token is ERC20: ${error}`);
    return false;
  }
}
