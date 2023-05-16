import React, { useState } from 'react';
import { ethers } from 'ethers';
import { prepareWriteContract, writeContract, getContract, fetchSigner } from '@wagmi/core'

import Uruloki from './abi/Uruloki.json';
import ERC20 from './abi/ERC20.json';

/* TODO
   1. Create order
   2. Edit order
   3. Delete order
   4. Add funds
   5. Withdraw funds
*/

export const useUrulokiAPI = () => {
    const chainId = 5;     // Goerli network
    const [isLoading, setIsLoading] = useState(false);

    const parseError = (errorData: any) => {
        if (errorData.startsWith('0x08c379a0')) { // decode Error(string)

            const content = `0x${errorData.substring(10)}`;
            const reason = ethers.utils.defaultAbiCoder.decode(["string"], content);

            return reason[0]; // reason: string; for standard revert error string
        }

        if (errorData.startsWith('0x4e487b71')) { // decode Panic(uint)
            const content = `0x${errorData.substring(10)}`;
            const code = ethers.utils.defaultAbiCoder.decode(["uint"], content);

            return code[0];
        }

        return '';
    }

    const addFunds = async (tokenAddress: string, amount: number) => {
        try {
            const signer = await fetchSigner();
            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                const decimals = await ERC20Contract.decimals();
                setIsLoading(true);
                await ERC20Contract.approve(`0x${Uruloki.address}`, ethers.utils.parseUnits(amount.toString(), decimals));

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'addFunds',
                    args: [tokenAddress, ethers.utils.parseUnits(amount.toString(), decimals)],
                    chainId: chainId
                });

                const { hash, wait } = await writeContract(config);
                await wait();

                setIsLoading(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('addFunds = ', err);
            return { msg: 'failure' };
        }
    }

    const withdrawFunds = async (tokenAddress: string, amount: number) => {
        try {
            const signer = await fetchSigner();
            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })

                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'withdrawFunds',
                    args: [tokenAddress, ethers.utils.parseUnits(amount.toString(), decimals)],
                    chainId: chainId
                })

                const { hash, wait } = await writeContract(config);
                await wait();

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
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })

                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'createNonContinuousPriceRangeOrder',
                    args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, ethers.utils.parseUnits(amount.toString(), decimals)],
                })
                const { hash } = await writeContract(config);
                console.log(hash);

                return hash;
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'createNonContinuousTargetPriceOrder',
                args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('createNonContinuousTargetPriceOrder = ', err);
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'createContinuousPriceRangeOrder',
                args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount, resetPercentage],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('createContinuousPriceRangeOrder = ', err);
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'createContinuousTargetPriceOrder',
                args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount, resetPercentage],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('createContinuousTargetPriceOrder = ', err);
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'editNonContinuousPriceRangeOrder',
                args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('editNonContinuousPriceRangeOrder = ', err);
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'editNonContinuousTargetPriceOrder',
                args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('editNonContinuousTargetPriceOrder = ', err);
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'editContinuousPriceRangeOrder',
                args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount, resetPercentage],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('editContinuousPriceRangeOrder = ', err);
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
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'editContinuousTargetPriceOrder',
                args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount, resetPercentage],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('editContinuousTargetPriceOrder = ', err);
        }
    }

    const cancelOrder = async (orderId: number) => {
        try {
            const config = await prepareWriteContract({
                address: `0x${Uruloki.address}`,
                abi: Uruloki.abi,
                functionName: 'cancelOrder',
                args: [orderId],
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error('cancelOrder = ', err);
        }
    }

    return {
        isLoading,
        addFunds,
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