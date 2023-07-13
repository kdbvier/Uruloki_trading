import { useState } from 'react';
import { ethers } from 'ethers';
import { prepareWriteContract, writeContract, getContract, getWalletClient, readContract } from '@wagmi/core'
import Uruloki from './abi/Uruloki.json';
import ERC20 from './abi/ERC20.json';

export const useUrulokiAPI = () => {
  const chainId = 5;     // Goerli network
  const [isRunning, setIsRunning] = useState(false);

  const parseUnits = (value: number, decimal: number) => {
    return ethers.utils.parseUnits(value.toString(), decimal)
  }

  const addFunds = async (tokenAddress: string, amount: number) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();
        const tx = await ERC20Contract.approve(`0x${Uruloki.address}`, parseUnits(amount, decimals));
        await tx.wait();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'addFunds',
          args: [tokenAddress, parseUnits(amount, decimals)],
          chainId: chainId
        });

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('addFunds = ', err);
      return { msg: 'failure' };
    }
  }

  type UseBalanceResponse = {
    msg: string,
    balance?: number
  }

  /**
   * Returns the users balance for the provided token address
   * @param walletAddress 
   * @param tokenAddress 
   * @returns 
   */
  const useBalance = async (walletAddress: string, tokenAddress: string): Promise<UseBalanceResponse> => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const data = await readContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'balances',
          args: [walletAddress, tokenAddress],
        })

        console.log("Reading balance:")
        console.log(data)

        return { msg: 'success', balance: data as number };
      }
    } catch (err) {
      console.error('getBalance = ', err);
      return { msg: 'failure' };
    }

    return {msg: 'failure'}
  }

  type TokenInfo = {
    name: string,
    shortName: string
  }
  type UseTokenInfoResponse = {
    msg: string,
    info?: TokenInfo
  }
  /**
   * Returns the ERC20 token info
   * @param tokenAddress 
   * @returns 
   */
  const useTokenInfo = async(tokenAddress: string): Promise<UseTokenInfoResponse> => {
    try {
      const signer = await getWalletClient();
      console.log('tokenAddress: ', tokenAddress)
      if (signer) {
        const name = await readContract({
          address: `0x${tokenAddress.substring(2)}`,
          abi: ERC20.abi,
          functionName: "name",
        })
        const symbol = await readContract({
          address: `0x${tokenAddress.substring(2)}`,
          abi: ERC20.abi,
          functionName: "symbol",
        })
        const result : UseTokenInfoResponse = {
          msg: 'success', 
          info: {
            name:name as string, shortName: symbol as string
          }
        }
        setIsRunning(false);
        return result
      }
    } catch (err) {
      console.log('useTokenInfoError: ', err)
      return { msg: 'failure' }
    }
    return {msg: 'failure'}
  }
  const withdrawFunds = async (tokenAddress: string, amount: number) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'withdrawFunds',
          args: [tokenAddress, parseUnits(amount, decimals)],
          chainId: chainId
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err: any) {
      console.error('withdrawFunds = ', err);
      return { msg: 'failure' };
    }
  }

  const createNonContinuousPriceRangeOrder = async (
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    minPrice: number,
    maxPrice: number,
    amount: number,
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'createNonContinuousPriceRangeOrder',
          args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals)],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('createNonContinuousPriceRangeOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const createNonContinuousTargetPriceOrder = async (
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    targetPrice: number,
    amount: number,
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'createNonContinuousTargetPriceOrder',
          args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals)],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('createNonContinuousTargetPriceOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const createContinuousPriceRangeOrder = async (
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    minPrice: number,
    maxPrice: number,
    amount: number,
    resetPercentage: number
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'createContinuousPriceRangeOrder',
          args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals), resetPercentage],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('createContinuousPriceRangeOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const createContinuousTargetPriceOrder = async (
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    targetPrice: number,
    amount: number,
    resetPercentage: number
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })

        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'createContinuousTargetPriceOrder',
          args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals), resetPercentage],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('createContinuousTargetPriceOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const editNonContinuousPriceRangeOrder = async (
    orderId: number,
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    minPrice: number,
    maxPrice: number,
    amount: number,
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })

        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'editNonContinuousPriceRangeOrder',
          args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals)],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('editNonContinuousPriceRangeOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const editNonContinuousTargetPriceOrder = async (
    orderId: number,
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    targetPrice: number,
    amount: number,
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'editNonContinuousTargetPriceOrder',
          args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals)],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('editNonContinuousTargetPriceOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const editContinuousPriceRangeOrder = async (
    orderId: number,
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    minPrice: number,
    maxPrice: number,
    amount: number,
    resetPercentage: number
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'editContinuousPriceRangeOrder',
          args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals), resetPercentage],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('editContinuousPriceRangeOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const editContinuousTargetPriceOrder = async (
    orderId: number,
    pairedTokenAddress: string,
    tokenAddress: string,
    isBuy: boolean,
    targetPrice: number,
    amount: number,
    resetPercentage: number
  ) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        const ERC20Contract: any = getContract({
          address: `0x${tokenAddress}`,
          abi: ERC20.abi,
          walletClient: signer
        })
        setIsRunning(true);
        const decimals = await ERC20Contract.decimals();

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'editContinuousTargetPriceOrder',
          args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals), resetPercentage],
        })

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('editContinuousTargetPriceOrder = ', err);
      return { msg: 'failure' };
    }
  }

  const cancelOrder = async (orderId: number) => {
    try {
      const signer = await getWalletClient();

      if (signer) {
        setIsRunning(true);

        const config = await prepareWriteContract({
          address: `0x${Uruloki.address}`,
          abi: Uruloki.abi,
          functionName: 'cancelOrder',
          args: [orderId],
        });

        const { hash } = await writeContract(config);
        setIsRunning(false);

        return { msg: 'success', hash: hash };
      }
    } catch (err) {
      console.error('cancelOrder = ', err);
      return { msg: 'failure' };
    }
  }

  return {
    isRunning,
    useTokenInfo,
    addFunds,
    useBalance,
    withdrawFunds,
    createContinuousPriceRangeOrder,
    createContinuousTargetPriceOrder,
    createNonContinuousPriceRangeOrder,
    createNonContinuousTargetPriceOrder,
    editContinuousPriceRangeOrder,
    editContinuousTargetPriceOrder,
    editNonContinuousPriceRangeOrder,
    editNonContinuousTargetPriceOrder,
    cancelOrder,
  };
}
